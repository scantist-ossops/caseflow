# frozen_string_literal: true

# Job that pushes priority cases to a judge rather than waiting for them to request cases. This will distribute cases
# to all judges whose teams that have `accepts_priority_pushed_cases` enabled. The first step distributes all priority
# cases tied to a judge without limit. The second step distributes remaining general population cases (cases not tied to
# an active judge) while attempting to even out the number of priority cases all judges have received over one month.
class PushPriorityAppealsToJudgesJob < CaseflowJob
  # For time_ago_in_words()
  include ActionView::Helpers::DateHelper

  queue_with_priority :low_priority
  application_attr :queue

  def perform
    unless use_by_docket_date?
      @tied_distributions = distribute_non_genpop_priority_appeals
    end

    @genpop_distributions = distribute_genpop_priority_appeals

    send_job_report
  rescue StandardError => error
    start_time ||= Time.zone.now # temporary fix to get this job to succeed
    duration = time_ago_in_words(start_time)
    slack_msg = "<!here>\n [ERROR] after running for #{duration}: #{error.message}"
    slack_service.send_notification(slack_msg, self.class.name)
    log_error(error)
  ensure
    datadog_report_runtime(metric_group_name: "priority_appeal_push_job")
  end

  def send_job_report
    slack_service.send_notification(slack_report.join("\n"), self.class.name)
  end

  def slack_report
    report = []
    if use_by_docket_date?
      total_cases = @genpop_distributions.map(&:distributed_batch_size).sum
      report << "*Number of cases distributed*: " \
                "#{total_cases}"
    else
      tied_distributions_sum = @tied_distributions.map(&:distributed_batch_size).sum
      genpop_distributions_sum = @genpop_distributions.map(&:distributed_batch_size).sum
      report << "*Number of cases tied to judges distributed*: " \
                "#{tied_distributions_sum}"
      report << "*Number of general population cases distributed*: " \
                "#{genpop_distributions_sum}"
    end

    appeals_not_distributed = docket_coordinator.dockets.map do |docket_type, docket|
      report << "*Age of oldest #{docket_type} case*: #{docket.oldest_priority_appeal_days_waiting} days"
      [docket_type, docket.ready_priority_appeal_ids]
    end.to_h

    report << "*Total Number of appeals _not_ distributed*: #{appeals_not_distributed.values.flatten.count}"
    docket_coordinator.dockets.each_pair do |sym, docket|
      report << "*Number of #{sym} appeals _not_ distributed*: #{docket.count(priority: true, ready: true)}"
    end
    unless disable_legacy?
      report << "*Number of Legacy Hearing Non Genpop appeals _not_ distributed*: #{legacy_not_genpop_count}"
    end

    report << ""
    report << "*Debugging information*"
    report << "Priority Target: #{priority_target}"
    report << "Previous monthly distributions {judge_id=>count}: #{priority_distributions_this_month_for_eligible_judges}"

    if appeals_not_distributed.values.flatten.any?
      add_stuck_appeals_to_report(report, appeals_not_distributed)
    end

    report
  end

  def add_stuck_appeals_to_report(report, appeals)
    report.unshift("[WARN]")
    report << COPY::PRIORITY_PUSH_WARNING_MESSAGE
    report << "AMA appeals not distributed: `Appeal.where(uuid: #{appeals.values.drop(1).flatten})`"
    report << "Legacy appeals not distributed: `LegacyAppeal.where(vacols_id: #{appeals[:legacy]})`"
  end

  # Distribute all priority cases tied to a judge without limit
  def distribute_non_genpop_priority_appeals
    eligible_judges.map do |judge|
      Distribution.create!(judge: User.find(judge.id), priority_push: true).tap(&:distribute!)
    end
  end

  # Distribute remaining general population cases while attempting to even out the number of priority cases all judges
  # have received over one month
  def distribute_genpop_priority_appeals
    eligible_judge_target_distributions_with_leftovers.map do |judge_id, target|
      Distribution.create!(
        judge: User.find(judge_id),
        priority_push: true
      ).tap { |distribution| distribution.distribute!(target) }
    end
  end

  # Give any leftover cases to judges with the lowest distribution targets. Remove judges with 0 cases to be distributed
  # as these are the final counts to distribute remaining ready priority cases
  def eligible_judge_target_distributions_with_leftovers
    leftover_cases = leftover_cases_count
    target_distributions_for_eligible_judges.sort_by(&:last).map do |judge_id, target|
      if leftover_cases > 0
        leftover_cases -= 1
        target += 1
      end
      (target > 0) ? [judge_id, target] : nil
    end.compact.to_h
  end

  # Because we cannot distribute fractional cases, there can be cases leftover after taking the priority target
  # into account. This number will always be less than the number of judges that need distribution because division
  def leftover_cases_count
    ready_genpop_priority_appeals_count - target_distributions_for_eligible_judges.values.sum
  end

  # Calculate the number of cases a judge should receive based on the priority target. Don't toss out judges with 0 as
  # they could receive some of the leftover cases (if any)
  def target_distributions_for_eligible_judges
    priority_distributions_this_month_for_eligible_judges.map do |judge_id, distributions_this_month|
      target = priority_target - distributions_this_month
      (target >= 0) ? [judge_id, target] : nil
    end.compact.to_h
  end

  # Calculates a target that will distribute all ready appeals so the remaining counts for each judge will produce
  # even case counts over a full month (or as close as we can get to it)
  def priority_target
    @priority_target ||= begin
      distribution_counts = priority_distributions_this_month_for_eligible_judges.values
      target = 0
      if distribution_counts.count > 0
        target = (distribution_counts.sum + ready_genpop_priority_appeals_count) / distribution_counts.count
      end

      # If there are any judges that have previous distributions that are MORE than the currently calculated priority
      # target, no target will be large enough to get all other judges up to their number of cases. Remove them from
      # consideration and recalculate the target for all other judges.
      while distribution_counts.any? { |distribution_count| distribution_count > target }
        distribution_counts = distribution_counts.reject { |distribution_count| distribution_count > target }
        target = (distribution_counts.sum + ready_genpop_priority_appeals_count) / distribution_counts.count
      end

      target
    end
  end

  def docket_coordinator
    @docket_coordinator ||= DocketCoordinator.new
  end

  def ready_genpop_priority_appeals_count
    @ready_genpop_priority_appeals_count ||= docket_coordinator.genpop_priority_count
  end

  # Number of priority distributions every eligible judge has received in the last month
  def priority_distributions_this_month_for_eligible_judges
    eligible_judges.map { |judge| [judge.id, priority_distributions_this_month_for_all_judges[judge.id] || 0] }.to_h
  end

  def eligible_judges
    @eligible_judges ||= JudgeTeam.pushed_priority_cases_allowed.map(&:judge)
  end

  # Produces a hash of judge_id and the number of cases distributed to them in the last month
  def priority_distributions_this_month_for_all_judges
    @priority_distributions_this_month_for_all_judges ||= priority_distributions_this_month
      .pluck(:judge_id, :statistics)
      .group_by(&:first)
      .map { |judge_id, arr| [judge_id, arr.flat_map(&:last).map { |stats| stats["batch_size"] }.sum] }.to_h
  end

  def priority_distributions_this_month
    Distribution.priority_pushed.completed.where(completed_at: 30.days.ago..Time.zone.now)
  end

  def use_by_docket_date?
    FeatureToggle.enabled?(:acd_distribute_by_docket_date, user: RequestStore.store[:current_user])
  end

  def disable_legacy?
    FeatureToggle.enabled?(:acd_disable_legacy_distributions, user: RequestStore.store[:current_user])
  end

  def legacy_not_genpop_count
    docket_coordinator.dockets[:legacy].not_genpop_priority_count
  end
end
