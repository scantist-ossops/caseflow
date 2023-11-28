# frozen_string_literal: true

RSpec.configure do |rspec|
  # This config option will be enabled by default on RSpec 4,
  # but for reasons of backwards compatibility, you have to
  # set it on RSpec 3.
  #
  # It causes the host group and examples to inherit metadata
  # from the shared context.
  # source: https://rspec.info/features/3-12/rspec-core/example-groups/shared-context/
  rspec.shared_context_metadata_behavior = :apply_to_host_groups
end

RSpec.shared_context "veterans", shared_context: :metadata do
  # --- Instantiate duplicate veteran checker
  # subject { DuplicateVeteranChecker.new }
  # Line above is not necessary because DuplicateVeteranChecker is the default subject.

  # --- Create a list of veterans without the duplicate file number
  let!(:veterans) { create_list(:veteran, 5) }

  let!(:duplicate_file_number) { "123456789" }

  # --- Create veteran one with duplicate file number
  let!(:ssn1) { "864296984" }
  let!(:participant_id1) { "987654" }
  let!(:dup_veteran1) do
    create(:veteran, file_number: duplicate_file_number, ssn: ssn1, participant_id: participant_id1)
  end

  # --- Create veteran two with duplicate file number
  # Can't do this yet because of the unique constrain.

  # let!(:ssn2) { "704545973" }
  # let!(:participant_id2) { "987655" }
  # let!(:dup_veteran2) do
  #   create(:veteran, file_number: duplicate_file_number, ssn: ssn2, participant_id: participant_id2)
  # end
end

RSpec.configure do |rspec|
  rspec.include_context "veterans", include_shared: true
end
