# frozen_string_literal: true

# Script to create Distribution and DistributedCase records in the Caseflow DB
# following a manual distribution of legacy appeals in VACOLS
#
# Script assumes that the files are in a tab-delimited .txt format and located in
# <caseflow-root>/vacols_distributions

# bundle exec rails runner scripts/add_distribution_records_for_manual_legacy_distributions.rb

# Load each .txt file
files = Dir[Rails.root.join("vacols_distributions/*.txt")]

# Get each row and transform into hash
records = []
puts "### Loading records from #{files.count} files"
files.each do |file|
  # these come out as text files delimited by 2-4 spaces (varying) between columns
  CSV.foreach(file.to_s, headers: true, col_sep: "  ") do |row|
    # .compact! will remove null or blank key/value pairs that occur when columns are delimited by 4 spaces
    records.push row.to_h.compact!
  end
end

# strip whitespace from both keys and values
records.map do |record|
  record.transform_keys!(&:strip)
  record.transform_values!(&:strip)
end

# Group by judge
records = records.group_by { |record| record["Charge to"] }

# these are the judge's STAFF.SLOGID value
judges = records.keys
puts "### Loaded #{records.values.flatten.count} records for #{records.keys.count} judges"

# For each judge create a distribution and distributed cases
judges.each do |judge_slogid|
  # find judge and create distribution object
  judge = VACOLS::Staff.find_by(slogid: judge_slogid)

  begin
    dist = Distribution.create!(judge: User.find_by_css_id(judge.sdomainid), priority_push: true)
  rescue ActiveRecord::RecordInvalid
    puts "### A pending Distribution exists for user #{judge_slogid}, skipping"
    next
  end

  puts "### Creating distribution for #{judge_slogid}"

  # this is in this scope for checking case count later
  dist_cases = []

  # for each record, build a distributed case if one doesn't already exist
  records[judge_slogid].each do |record|
    # provided Appeal ID value is the BFCORLID, not BFKEY
    legacy_appeal = LegacyAppeal.find_by(vbms_id: record["Appeal Id"])

    # skip if a distributed case already exists
    next if DistributedCase.find_by(case_id: legacy_appeal.vacols_id)

    puts "### Creating DistributedCase for VACOLS case #{legacy_appeal.vacols_id}"

    # get relevant PRIORLOC records
    location_hist = legacy_appeal.location_history.order(:locdin)

    # when being assigned to judge, the judge is both the user and organization in a PRIORLOC record
    judge_assignment_entry = location_hist.filter { |l| l.locstto == judge_slogid && l.locstrcv == judge_slogid }.first

    # the distribution entry is the one where it's check-in time matches the judge assignment entry's check-out time
    distribution_entry = location_hist.filter { |l| l.locdin == judge_assignment_entry.locdout }.first

    # location codes 81 and 83 are how we check if a case is ready for distribution
    ready_at =
      if distribution_entry.locstto == "81" || distribution_entry.locstto == "83"
        distribution_entry.locdout
      else
        # failsafe in case something goes wrong with getting location histories
        puts "### Unable to determine ready_at value for case #{legacy_appeal.vacols_id}"
        record["Date Charged"]
      end

    # create a new distributed case for found values, but don't save it
    dist_case = DistributedCase.new(
      distribution: dist,
      case_id: legacy_appeal.vacols_id,
      docket: "legacy",
      priority: true,
      ready_at: ready_at,
      docket_index: nil,
      genpop: true,
      genpop_query: "any"
    )

    dist_cases.push(dist_case)
  end

  # save distribution and distributed cases unless no distributed cases were built
  if dist_cases.count > 0
    # Create distribution statistics object. batch_size and algorithm are all that we can populate, but
    # the others are left as a part of the object in case other application code requires it
    stats = {
      batch_size: dist_cases.count,
      total_batch_size: nil,
      priority_target: nil,
      priority: {},
      nonpriority: {},
      algorithm: "manual_legacy_distribution",
      settings: {}
    }

    # save distribution and reload before saving distributed cases so that it has an id value
    dist.save!
    dist.reload

    # reassign the saved distribution to the case so that the ID is present on the distribution
    dist_cases.map do |dist_case|
      dist_case.distribution = dist
      dist_case.save!
    end

    puts "### #{dist_cases.count} DistributedCases added to Distribution #{dist.id} for user #{judge}"
    # update distribution status and completed at and add statistics
    dist.update!(status: "completed", completed_at: Time.zone.now, statistics: stats)
  else
    puts "### No DistributedCases created for #{judge}, destroying the Distribution"
    # no distributed cases were created for this judge so delete the distribution
    dist.destroy!
  end
end

puts "### Manual creation of Distributions complete"
