# frozen_string_literal: true

# bundle exec rails runner scripts/4013_uat_class_methods.rb

# Get the program and regional offices that cases will be assigned to
@vha_program_office ||= Organization.find_by(type: "VhaProgramOffice", name: "Community Care - Payment Operations Management")
@vha_regional_office ||= Organization.find_by(type: "VhaRegionalOffice", name: "VA Southeast Network")

# Create non-caregiver request issues
def create_vha_request_issue
  RequestIssue.create!(benefit_type: 'vha', is_predocket_needed: true, nonrating_issue_category: Constants.ISSUE_CATEGORIES.vha.reject { |c| c.include?('Caregiver') }.sample, nonrating_issue_description: "Test")
end

# Create caregiver request issues
def create_vha_caregiver_request_issue
  RequestIssue.create!(benefit_type: 'vha', is_predocket_needed: true, nonrating_issue_category: Constants.ISSUE_CATEGORIES.vha.filter { |c| c.include?('Caregiver') }.sample, nonrating_issue_description: "Test")
end

# Add request issues to appeal
def add_issues_to_decision_review(decision_review, request_issues)
  decision_review.request_issues << request_issues
end

# Create intake (with intake user)
def create_intake_for_decision_review(decision_review)
  intake_user = Organization.find_by(type: "BvaIntake").users.first
  Intake.create!(completed_at: Time.zone.now, completion_status: "success", started_at: Time.zone.now, detail_id: decision_review.id, detail_type: decision_review.class.name, type: "#{decision_review.class.name}Intake", user_id: intake_user.id, veteran_file_number: decision_review.veteran_file_number, veteran_id: decision_review.veteran.id)
end

# Create new AssessDocumentationTask and assign to desired org
def create_assess_documentation_task_for_org(appeal, organization)
  # org = Organization.where(type: 'VhaProgramOffice').first
  parent_task = appeal.tasks.find_by(type: "AssessDocumentationTask") || appeal.tasks.find_by(type: "VhaDocumentSearchTask")
  AssessDocumentationTask.create!(appeal_id: appeal.id, appeal_type: appeal.class.name, assigned_at: Time.zone.now, assigned_by_id: parent_task.assigned_to_id, assigned_to_id: organization.id, assigned_to_type: "Organization", parent_id: parent_task.id, status: 'assigned')
end

def create_appeal(veteran: nil, type: nil)
  # Create appeal
  appeal = Appeal.create!(docket_type: Constants.AMA_DOCKETS.direct_review, established_at: Time.zone.now, filed_by_va_gov: false, receipt_date: Date.today, veteran_file_number: veteran.file_number)

  # Create request issues array and populate it with unique request issues
  request_issues = []
  rand(3..4).times do
    issue =
      if type == "Caregiver"
        create_vha_caregiver_request_issue
      else
        create_vha_request_issue
      end

    request_issues << issue unless request_issues.map(&:nonrating_issue_category).include?(issue.nonrating_issue_category)
  end

  add_issues_to_decision_review(appeal, request_issues)

  create_intake_for_decision_review(appeal)

  # Create tasks on intake success
  appeal.create_tasks_on_intake_success!
  appeal.reload

  case type
  when "Program Office"

    create_assess_documentation_task_for_org(appeal, @vha_program_office)
  when "VISN unassigned"
    create_assess_documentation_task_for_org(appeal, @vha_program_office)
    create_assess_documentation_task_for_org(appeal, @vha_regional_office)
  when "VISN in progress"
    create_assess_documentation_task_for_org(appeal, @vha_program_office)
    ro_task = create_assess_documentation_task_for_org(appeal, @vha_regional_office)
    ro_task.update!(status: Constants.TASK_STATUSES.in_progress)
  else
    nil
  end

  nil
end

def create_hlr(veteran: nil)
  hlr = HigherLevelReview.create!(benefit_type: "vha", establishment_attempted_at: Time.zone.now, establishment_last_submitted_at: Time.zone.now, establishment_submitted_at: Time.zone.now, establishment_processed_at: Time.zone.now, filed_by_va_gov: false, receipt_date: Date.today, informal_conference: false, legacy_opt_in_approved: false, veteran_file_number: veteran.file_number, veteran_is_not_claimant: false)

  request_issues = []
  rand(3..4).times do
    issue = create_vha_request_issue
    issue.update!(decision_date: 1.month.ago)
    request_issues << issue unless request_issues.map(&:nonrating_issue_category).include?(issue.nonrating_issue_category)
  end

  add_issues_to_decision_review(hlr, request_issues)

  create_intake_for_decision_review(hlr)

  hlr.create_business_line_tasks!
  hlr.reload

  nil
end

RequestStore[:current_user] = User.system_user

veterans = Veteran.all.sample(180)
types = ["Caregiver", "VHA CAMO", "Program Office", "VISN unassigned", "VISN in progress"]

types.each do |type|
  30.times do
    create_appeal(veteran: veterans.pop, type: type)
  end
end

# Create HLRs in the VHA Decision Review queue
30.times do
  create_hlr(veteran: veterans.pop)
end
