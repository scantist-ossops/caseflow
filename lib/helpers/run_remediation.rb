# frozen_string_literal: true

class RunRemediation
  def initialize(duplicate_veteran_file_number)
    @duplicate_veteran_file_number = duplicate_veteran_file_number
    @v = Veteran.find_by_file_number(@duplicate_veteran_file_number)
    @old_file_number = @v.file_number
    @vet_ssn = @v.ssn
    @dupe_vets = Veteran.where("ssn = ? or participant_id = ?", @v.ssn, @v.participant_id)
    @v2 = nil
  end

  def find_duplicate_vets
    vets = Veteran.where(file_number: duplicate_veteran_file_number)
    if vets.nil? || vets.count > 1
      puts("More than on vet with the duplicate veteran file number exists. Aborting..")
    else
      vets
    end
  end

  def check_vet_nil?
    puts("No veteran found. Aborting.") if @v.nil?
    fail Interrupt
  end

  def set_duplicate_vet_pair
    verify_pair

    other_v = @dupe_vets.first # grab first of the dupilicates and check if the duplicate veteran}
    if other_ @v.file_number == @old_file_number
      other_v = @dupe_vets.last # First is duplicate veteran so get 2nd
    end

    duplicate_vet_ssn(other_v)

    @v2 = other_v
  end

  # 🚧 ⬇️

  duplicate_relations = ""

  # Get the correct file number from a BGS call out
  file_number = BGSService.new.fetch_file_number_by_ssn(@vet_ssn)

  if file_number != @v2.file_number
    puts("File number from BGS does not match correct veteran record. Aborting...")
    fail Interrupt
  end

  # The following code runs through all possible relations
  # to the duplicat evetran by file number or veteran id
  # collects all counts and displays all relations
  as = Appeal.where(veteran_file_number: @old_file_number)

  as_count = as.count

  duplicate_relations += as_count.to_s + " Appeals\n"

  las = LegacyAppeal.where(vbms_id: convert_file_number_to_legacy(@old_file_number))

  las_count = las.count

  duplicate_relations += las_count.to_s + " LegacyAppeals\n"

  ahls = AvailableHearingLocations.where(veteran_file_number: @old_file_number)

  ahls_count = ahls.count

  duplicate_relations += ahls_count.to_s + " Avialable Hearing Locations\n"

  bpoas = BgsPowerOfAttorney.where(file_number: @old_file_number)

  bpoas_count = bpoas.count

  duplicate_relations += bpoas_count.to_s + " BgsPowerOfAAttorneys\n"

  ds = Document.where(file_number: @old_file_number)

  ds_count = ds.count

  duplicate_relations += ds_count.to_s + " Documents\n"

  epes = EndProductEstablishment.where(veteran_file_number: @old_file_number)

  epes_count = epes.count

  duplicate_relations += epes_count.to_s + " EndProductEstablishment\n"

  f8s = Form8.where(file_number: convert_file_number_to_legacy(@old_file_number))

  f8s_count = f8s.count

  duplicate_relations += f8s_count.to_s + " Form8\n"

  hlrs = HigherLevelReview.where(veteran_file_number: @old_file_number)

  hlrs_count = hlrs.count

  duplicate_relations += hlrs_count.to_s + " HigherLevelReview\n"

  is_fn = Intake.where(veteran_file_number: @old_file_number)

  is_fn_count = is_fn.count

  duplicate_relations += is_fn_count.to_s + " Intakes related by file number\n"

  is_vi = Intake.where(veteran_id: @v.id)

  is_vi_count = is_vi.count

  duplicate_relations += is_vi_count.to_s + " Intakes related by veteran id\n"

  res = RampElection.where(veteran_file_number: @old_file_number)

  res_count = res.count

  duplicate_relations += res_count.to_s + " RampElection\n"

  rrs = RampRefiling.where(veteran_file_number: @old_file_number)

  rrs_count = rrs.count

  duplicate_relations += rrs_count.to_s + " RampRefiling\n"

  scs = SupplementalClaim.where(veteran_file_number: @old_file_number)

  scs_count = scs.count

  duplicate_relations += scs_count.to_s + " SupplementalClaim\n"

  puts("Duplicate Veteran Relations:\n" + duplicate_relations)

  # Get relationship list for correct veteran

  correct_relations = ""

  as2 = Appeal.where(veteran_file_number: file_number)

  as2_count = as2.count

  correct_relations += as2_count.to_s + " Appeals\n"

  las2 = LegacyAppeal.where(vbms_id: convert_file_number_to_legacy(file_number))

  las2_count = las2.count

  correct_relations += las2_count.to_s + " LegacyAppeals\n"

  ahls2 = AvailableHearingLocations.where(veteran_file_number: file_number)

  ahls2_count = ahls2.count

  correct_relations += ahls2_count.to_s + " Avialable Hearing Locations\n"

  bpoas2 = BgsPowerOfAttorney.where(file_number: file_number)

  bpoas2_count = bpoas2.count

  correct_relations += bpoas2_count.to_s + " BgsPowerOfAAttorneys\n"

  ds2 = Document.where(file_number: file_number)

  ds2_count = ds2.count

  correct_relations += ds2_count.to_s + " Documents\n"

  epes2 = EndProductEstablishment.where(veteran_file_number: file_number)

  epes2_count = epes2.count

  correct_relations += epes2_count.to_s + " EndProductEstablishment\n"

  f8s2 = Form8.where(file_number: convert_file_number_to_legacy(file_number))

  f8s2_count = f8s2.count

  correct_relations += f8s2_count.to_s + " Form8\n"

  hlrs2 = HigherLevelReview.where(veteran_file_number: file_number)

  hlrs2_count = hlrs2.count

  correct_relations += hlrs2_count.to_s + " HigherLevelReview\n"

  is_fn2 = Intake.where(veteran_file_number: file_number)

  is_fn2_count = is_fn2.count

  correct_relations += is_fn2_count.to_s + " Intakes related by file number\n"

  is_vi2 = Intake.where(veteran_id: @v.id)

  is_vi2_count = is_vi2.count

  correct_relations += is_vi2_count.to_s + " Intakes related by veteran id\n"

  res2 = RampElection.where(veteran_file_number: file_number)

  res2_count = res2.count

  correct_relations += res2_count.to_s + " RampElection\n"

  rrs2 = RampRefiling.where(veteran_file_number: file_number)

  rrs2_count = rrs2.count

  correct_relations += rrs2_count.to_s + " RampRefiling\n"

  scs2 = SupplementalClaim.where(veteran_file_number: file_number)

  scs2_count = scs2.count

  correct_relations += scs2_count.to_s + " SupplementalClaim\n"

  puts("Correct Veteran Relations:\n" + correct_relations)

  # migrate duplicate veteran relations to correct veteran

  error_relations = ""

  as_update_count = as.update_all(veteran_file_number: file_number)

  if as_update_count != as_count
    error_relations += "Expected " + as_count + " Appeals updated, but " + as_update_count + "were updated.\n"
  end

  vbms_id = LegacyAppeal.convert_file_number_to_vacols(file_number)

  las.each do |legapp|
    legapp.case_record.update!(bfcorlid: vbms_id)
    legapp.case_record.folder.update!(titrnum: vbms_id)
    legapp.case_record.correspondent.update!(slogid: vbms_id)
  end

  las_update_count = las.update_all(vbms_id: vbms_id)

  if las_update_count != las_count
    error_relations += "Expected " + las_count + " LegacyAppeals updated, but " + las_update_count + "were updated.\n"
  end

  ahls_update_count = ahls.update_all(veteran_file_number: file_number)

  if ahls_update_count != ahls_count
    error_relations += "Expected " + ahls_count + " HearingLocations updated, but " + ahls_update_count + "were updated.\n"
  end

  bpoas_update_count = bpoas.update_all(file_number: file_number)

  if bpoas_update_count != bpoas_count
    error_relations += "Expected " + bpoas_count + " BgsPowerOfAttorneys updated, but " + as_update_count + "were updated.\n"
  end

  ds_update_count = ds.update_all(file_number: file_number)

  if ds_update_count != ds_count
    error_relations += "Expected " + ds_count + " Documents updated, but " + ds_update_count + "were updated.\n"
  end

  epes_update_count = epes.update_all(veteran_file_number: file_number)

  if epes_update_count != epes_count
    error_relations += "Expected " + epes_count + " EndProductEstablishments updated, but " + epes_update_count + "were updated\n"
  end

  f8s_update_count = f8s.update_all(file_number: vbms_id)

  if f8s_update_count != f8s_count
    error_relations += "Expected " + f8s_count + " Form8s updated, but " + f8s_update_count + "were updated.\n"
  end

  hlrs_update_count = hlrs.update_all(veteran_file_number: file_number)

  if hlrs_update_count != hlrs_count
    error_relations += "Expected " + hlrs_count + " HigherLevelReviews updated, but " + hlrs_update_count + "were updated.\n"
  end

  is_fn_update_count = is_fn.update_all(veteran_file_number: file_number)

  if is_fn_update_count != is_fn_count
    error_relations += "Expected " + is_fn_count + " Intakes by file number updated, but " + is_fn_update_count + "were updated.\n"
  end

  is_vi_update_count = is_vi.update_all(veteran_id: @v2.id)

  if is_vi_update_count != is_vi_count
    error_relations += "Expected " + is_vi_count + " Intakes by veteran id updated, but " + is_vi_update_count + "were updated.\n"
  end

  res_update_count = res.update_all(veteran_file_number: file_number)

  if res_update_count != res_count
    error_relations += "Expected " + res_count + " RampElections updated, but " + res_update_count + "were updated.\n"
  end

  rrs_update_count = rrs.update_all(veteran_file_number: file_number)

  if rrs_update_count != rrs_count
    error_relations += "Expected " + rrs_count + " RampRefilings updated, but " + rrs_update_count + "were updated.\n"
  end

  scs_update_count = scs.update_all(veteran_file_number: file_number)

  if scs_update_count != scs_count
    error_relations += "Expected " + scs_count + " SupplimentalCliams updated, but " + scs_update_count + "were updated.\n"
  end

  if !error_relations.empty?
    puts("There were differences in duplicate relations and update relations.")
    puts(error_relations)
    puts("Stoping script here. Need manual intervention")
    fail Interrupt
  end

  # Check if duplicate veteran relationships are all gone
  existing_relations = ""
  as = Appeal.where(veteran_file_number: @old_file_number)

  as_count = as.count
  if as_count != 0
    existing_relations += as_count.to_s + " Appeal still exists.\n"
  end

  las = LegacyAppeal.where(vbms_id: LegacyAppeal.convert_file_number_to_vacols(@old_file_number))

  las_count = las.count
  if las_count != 0
    existing_relations += as_count.to_s + " LegacyAppeal still exists.\n"
  end

  ahls = AvailableHearingLocations.where(veteran_file_number: @old_file_number)

  ahls_count = ahls.count
  if ahls_count != 0
    existing_relations += ahls_count.to_s + " AvaialbelHearings still exists.\n"
  end

  bpoas = BgsPowerOfAttorney.where(file_number: @old_file_number)

  bpoas_count = bpoas.count

  if bpoas_count != 0
    existing_relations += bpoas_count.to_s + " BgsPowerOfAttorneys still exists.\n"
  end

  ds = Document.where(file_number: @old_file_number)

  ds_count = ds.count

  if ds_count != 0
    existing_relations += ds_count.to_s + " Document still exists.\n"
  end

  epes = EndProductEstablishment.where(veteran_file_number: @old_file_number)

  epes_count = epes.count

  if epes_count != 0
    existing_relations += epes_count.to_s + " EndProductEstablishment still exists.\n"
  end

  f8s = Form8.where(file_number: LegacyAppeal.convert_file_number_to_vacols(@old_file_number))

  f8s_count = f8s.count

  if f8s_count != 0
    existing_relations += f8s_count.to_s + " Form8 still exists.\n"
  end

  hlrs = HigherLevelReview.where(veteran_file_number: @old_file_number)

  hlrs_count = hlrs.count

  if hlrs_count != 0
    existing_relations += hlrs_count.to_s + " HilerLevelReview still exists.\n"
  end

  is_fn = Intake.where(veteran_file_number: @old_file_number)

  is_fn_count = is_fn.count

  if is_fn_count != 0
    existing_relations += is_fn_count.to_s + " Intake by file_number still exists.\n"
  end

  is_vi = Intake.where(veteran_id: @v.id)

  is_vi_count = is_vi.count

  if is_vi_count != 0
    existing_relations += is_vi_count.to_s + " intake by vet id still exists.\n"
  end

  res = RampElection.where(veteran_file_number: @old_file_number)

  res_count = res.count

  if res_count != 0
    existing_relations += res_count.to_s + " RampElection still exists.\n"
  end

  rrs = RampRefiling.where(veteran_file_number: @old_file_number)

  rrs_count = rrs.count

  if rrs_count != 0
    existing_relations += rrs_count.to_s + " RampRefiling still exists.\n"
  end

  scs = SupplementalClaim.where(veteran_file_number: @old_file_number)

  scs_count = scs.count

  if scs_count != 0
    existing_relations += scs_count.to_s + " SupplementalClaim still exists.\n"
  end

  if !existing_relations.empty?
    puts("Duplicate veteran still has associated records. Can not delete untill resolved:\n" + existing_relations)
    fail Interrupt
  end

  # delete duplicate veteran
  @v.destroy!

  if Veteran.find_by_file_number(@old_file_number).present?
    puts("Veteran failed to be deleted.")
  end

  private

  def verify_pair
    case @dupe_vets
    when @dupe_vets.nil? || @dupe_vets.count < 2
      puts("No duplicate veteran found")
      fail Interrupt
    when @dupe_vets.count > 2
      puts("More than two veterans found. Aborting")
      fail Interrupt
    end
  end

  def duplicate_vet_ssn(other_v)
    validate_dup_vet(other_v)

    @vet_ssn = case other_v
               when @v.ssn.empty? && !other_v.ssn.empty?
                 other_v.ssn
               else
                 @v.ssn
               end
  end

  def validate_dup_vet(other_v)
    case other_v
    when other_v.file_number.empty? || other_v.file_number == @old_file_number
      puts("Both veterans have the same file_number or No file_number on the correct veteran. Aborting...")
      fail Interrupt
    when @v.ssn.empty? && other_v.ssn.empty?
      puts("Neither veteran has a ssn and a ssn is needed to check the BGS file number. Aborting")
      fail Interrupt
    when !other_v.ssn.empty? && @v.ssn != other_v.ssn
      puts("Veterans do not have the same ssn and a correct ssn needs to be chosen. Aborting.")
      fail Interrupt
    end
  end
end
