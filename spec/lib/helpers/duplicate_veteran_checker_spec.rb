# frozen_string_literal: true

# Test it checks for veteran duplicates
RSpec.feature DuplicateVeteranChecker do
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
    it "simple math" do
      expect(1 + 1).to eq(2)
    end
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

    context "finds pair of duplicate veterans" do
      describe "checks for duplicate veterans by file number" do
        it "aborts if more than one or none veterans have the duplicated number" do
        end

        it "aborts if veteran not found with file number" do
        end
      end

      describe "checks for duplicate veterans by participant id or ssn" do
        it "aborts if no duplicate veteran found" do
        end

        it "aborts if more than two duplicated veterans found" do
        end

        describe "when there is pair of duplicate veterans found" do
          it "confirms first veteran in pair is indeed a duplicate and assigns second veteran to other_v variable" do
            # I have now vet1 and vet2
          end

          it "aborts if both veterans have the same file_number or No file_number on the correct veteran" do
          end

          it "abort if neither veteran has a ssn and a ssn is needed to check the BGS file number" do
          end

          it "abort if veterans do not have the same ssn and a correct ssn needs to be chosen" do
          end
        end

        it "sets duplicate veteran one as 'v'" do
        end

        it "sets duplicate veteran two as 'v2'" do
        end

        it "gets file number from BGS with veteran one ssn" do
        end

        it "aborts if file number from BGS does not match veteran two file number" do
        end
      end
    end

    ##
    # Relations
    # examples need to test for both veteran one and two.
    ##

    context "checks all possible relations to the duplicate veteran" do
      describe "checks relations to Appeals" do
        it "gets list of Appeals with the original file number" do
        end

        it "gets total related Appeals count" do
        end

        it "saves Appeals count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'Legacy Appeals'" do
        it "gets list of 'Legacy Appeals' with the original file number" do
        end

        it "gets total related 'Legacy Appeals' count" do
        end

        it "saves 'Legacy Appeals' count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'Available Hearing Locations'" do
        it "gets list of 'Available Hearing Locations' with the original file number" do
        end

        it "gets total related 'Available Hearing Locations' count" do
        end

        it "saves 'Available Hearing Locations' count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'BGS Power of Attorneys'" do
        it "gets list of 'BGS Power of Attorneys' with the original file number" do
        end

        it "gets total related 'BGS Power of Attorneys' count" do
        end

        it "saves 'BGS Power of Attorneys' count to 'duplicate_relations' variable" do
        end
      end

      it "gets list of Documents with the original file number" do
        describe "checks relations to Documents" do
        end

        it "gets total related Documents count" do
        end

        it "saves Documents count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'End Product Establishment'" do
        it "gets list of 'End Product Establishment' with the original file number" do
        end

        it "gets total related 'End Product Establishment' count" do
        end

        it "saves 'End Product Establishment' count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'Form 8'" do
        it "gets list of 'Form 8' with the original file number" do
        end

        it "gets total related 'Form 8' count" do
        end

        it "saves 'Form 8' count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'Higher Level Review'" do
        it "gets list of 'Higher Level Review' with the original file number" do
        end

        it "gets total related 'Higher Level Review' count" do
        end

        it "saves 'Higher Level Review' count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'Intakes related by file number'" do
        it "gets list of 'Intakes related by file number' with the original file number" do
        end

        it "gets total 'Intakes related by file number' count" do
        end

        it "saves 'Intakes related by file number' count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'Intakes related by veteran id'" do
        it "gets list of 'Intakes related by veteran id' with the original file number" do
        end

        it "gets total 'Intakes related by veteran id' count" do
        end

        it "saves 'Intakes related by veteran id' count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'Ramp Election'" do
        it "gets list of 'Ramp Election' with the original file number" do
        end

        it "gets total related 'Ramp Election' count" do
        end

        it "saves 'Ramp Election' count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'Ramp Refiling'" do
        it "gets list of 'Ramp Refiling' with the original file number" do
        end

        it "gets total related 'Ramp Refiling' count" do
        end

        it "saves 'Ramp Refiling' count to 'duplicate_relations' variable" do
        end
      end

      describe "checks relations to 'Supplemental Claim'" do
        it "gets list of 'Supplemental Claim' with the original file number" do
        end

        it "gets total related 'Supplemental Claim' count" do
        end

        it "saves 'Supplemental Claim' count to 'duplicate_relations' variable" do
        end
      end
    end

    describe "Migrate duplicate veteran relations to correct veteran" do
      # Notes
      # 552 -> 'as_update_count', appeals update count.
      # 554 -> if true updates 'error_relations' variable.
      # 558 -> convert file number to vacols - vbms_id - using the correct file number obtained from the BGS Service.
      # 560 -> update each legacy application case record.
      # 566 -> update legacy appeals count with the vbms_id.
      # 568 -> throw error if legacy applications count doesn't match the updated legacy applications count.
      # 572 -> update available hearing locations count with the vbms_id.
      # 574 -> throw error if available hearing locations count doesn't match the updated legacy applications count.
      # 578 -> update bgs power of attorney count - bpoas_update_count
      # 580 -> throw error if bpoas updated count doesn't match bpoas_count.
      # 584 -> udpate documents count
      # 586 -> throw error if updated ds count doesn't match the documents count.
      # 590 -> update end product establishment count - epes_update_count.
      # 592 -> throw error if epes updated count doesn't match epes count.
      # 596 -> update f8 form count - f8s_update_count
      # 598 -> throw error if doesnt' match f8s_count.
      # 602 -> update higher level review count. hlrs_update_count
      # 608 -> update intake by file number. is_fn_update_count
      # 610 -> throw error if doesn't match is_fn count.
      # 614 -> update intake by veteran id. is_vi_update_count.
      # 616 -> throw error if doesn't much is_vi.
      # 620 -> update ramp election. res_update_count.
      # 622 -> throw error if count doesn't match res_count.
      # 626 -> update ramp refiling. rrs_update_count.
      # 628 -> throw error if count doesn't match rrs_count.
      # 632 -> update supplemental Claim. scs_update_count.
      # 634 -> throw error if count doesn't match scs_count.
      # 638 -> Abort if error_relations not empty.
      #
    end

    describe "all duplicate relationships are gone" do
      # --- Check all duplicate veteran relationships are all gone.
      # 645 to 746 -> gets a count for each of the above and checks that is zero.
      # if not, it puts still exists.
      # 748 -> checks whether existing relationships are empty. If not puts a message requesting to resolve.
    end

    describe "deletes duplicate veteran" do
      # --- Delete duplicate vetearn.
      # 754 -> destroy extra veteran record.
      # 756 -> verify it was deleted.
    end
  end

  describe "convert_file_number_to_legacy" do
    # TODO: Add test here
  end
end
