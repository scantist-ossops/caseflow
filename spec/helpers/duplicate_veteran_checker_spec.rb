# frozen_string_literal: true

# Test it checks for veteran duplicates
RSpec.feature "Duplicate Veteran Checker" do
  ##
  # -- run_remediation notes
  # We may need the following variables:
  # vets = lits of veterans using factorybot
  # v = Veteran.find_by_file_number(duplicate_veteran_file_number)
  # Check if there in fact duplicate veterans. Can be duplicated with
  # same partipant id or ssn
  # dupe_vets = Veteran.where("ssn = ? or participant_id = ?", v.ssn, v.participant_id)
  # Get the correct file number from a BGS call out
  # file_number = BGSService.new.fetch_file_number_by_ssn(vet_s
  # las = LegacyAppeal.where(vbms_id: convert_file_number_to_legacy(old_file_number))
  # ahls = AvailableHearingLocations.where(veteran_file_number: old_file_number)
  # bpoas = BgsPowerOfAttorney.where(file_number: old_file_number)
  # ds = Document.where(file_number: old_file_number)
  # epes = EndProductEstablishment.where(veteran_file_number: old_file_number)
  # f8s = Form8.where(file_number: convert_file_number_to_legacy(old_file_number))
  # hlrs = HigherLevelReview.where(veteran_file_number: old_file_number)
  # is_fn = Intake.where(veteran_file_number: old_file_number)
  # is_vi = Intake.where(veteran_id: v.id)
  # res = RampElection.where(veteran_file_number: old_file_number)
  # rrs = RampRefiling.where(veteran_file_number: old_file_number)
  # scs = SupplementalClaim.where(veteran_file_number: old_file_number)
  # as2 = Appeal.where(veteran_file_number: file_number)
  # las2 = LegacyAppeal.where(vbms_id: convert_file_number_to_legacy(file_number))
  # ahls2 = AvailableHearingLocations.where(veteran_file_number: file_number)
  # bpoas2 = BgsPowerOfAttorney.where(file_number: file_number)
  # ds2 = Document.where(file_number: file_number)
  # epes2 = EndProductEstablishment.where(veteran_file_number: file_number)
  # f8s2 = Form8.where(file_number: convert_file_number_to_legacy(file_number))
  # f8s2 = Form8.where(file_number: convert_file_number_to_legacy(file_number
  # hlrs2 = HigherLevelReview.where(veteran_file_number: file_number)
  # is_fn2 = Intake.where(veteran_file_number: file_number)
  # is_vi2 = Intake.where(veteran_id: v.id)
  # res2 = RampElection.where(veteran_file_number: file_number)
  # rrs2 = RampRefiling.where(veteran_file_number: file_number)
  # scs2 = SupplementalClaim.where(veteran_file_number: file_number)

  describe "can check_by_ama_appeal_uuid" do
    # TODO: Add test here
  end

  describe "run_remediation_by_ama_appeal_uuid" do
    # TODO: Add test here
  end

  describe "check_by_legacy_appeal_vacols_id" do
    # TODO: Add test here
  end

  describe "run_remediation_by_vacols_id" do
    # TODO: Add test here
  end

  describe "check_by_duplicate_veteran_file_number" do
    # TODO: Add test here
  end

  describe "run_remediation" do
    # TODO: Add test here
  end

  describe "convert_file_number_to_legacy" do
    # TODO: Add test here
  end
end
