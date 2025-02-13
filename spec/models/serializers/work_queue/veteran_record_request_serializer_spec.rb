# frozen_string_literal: true

describe WorkQueue::VeteranRecordRequestSerializer, :postgres do
  let(:veteran) { create(:veteran) }
  let(:appeal) { create(:appeal, veteran_file_number: veteran.file_number) }
  let(:non_comp_org) { create(:business_line, name: "Non-Comp Org", url: "nco") }
  let(:task) { create(:veteran_record_request_task, appeal: appeal, assigned_to: non_comp_org) }

  subject { described_class.new(task) }

  describe "#as_json" do
    it "renders ready for client consumption" do
      serializable_hash = {
        id: task.id.to_s,
        type: :veteran_record_request,
        attributes: {
          has_poa: true,
          claimant: { name: appeal.veteran_full_name, relationship: "self" },
          appeal: { id: appeal.uuid.to_s, isLegacyAppeal: false, issueCount: 0 },
          power_of_attorney: {
            representative_address: appeal&.representative_address,
            representative_email_address: appeal&.representative_email_address,
            representative_name: appeal&.representative_name,
            representative_type: appeal&.representative_type,
            representative_tz: appeal&.representative_tz,
            poa_last_synced_at: appeal&.poa_last_synced_at
          },
          appellant_type: appeal.claimant.type,
          veteran_ssn: veteran.ssn,
          veteran_participant_id: veteran.participant_id,
          assigned_on: task.assigned_at,
          assigned_at: task.assigned_at,
          closed_at: task.closed_at,
          started_at: task.started_at,
          tasks_url: "/decision_reviews/nco",
          id: task.id,
          created_at: task.created_at,
          issue_count: 0,
          issue_types: "",
          type: "Record Request",
          business_line: non_comp_org.url,
          external_appeal_id: appeal.uuid,
          appeal_type: "Appeal"
        }
      }

      expect(subject.serializable_hash[:data]).to eq(serializable_hash)
    end
  end
end
