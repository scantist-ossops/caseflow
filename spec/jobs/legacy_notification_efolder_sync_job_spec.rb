# frozen_string_literal: true

describe LegacyNotificationEfolderSyncJob, :all_dbs, type: :job do
  include ActiveJob::TestHelper

  self.use_transactional_tests = false

  let(:current_user) { create(:user, roles: ["System Admin"]) }
  let(:job) { LegacyNotificationEfolderSyncJob.new }

  BATCH_LIMIT_SIZE = 5

  describe "perform" do
    let(:today) { Time.now.utc.iso8601 }

    let(:cases) do
      create_list(:case, 10) do |vacols_case, i|
        vacols_case.update!(bfkey: "70023000#{i}", bfcorlid: "10000010#{i}")
      end
    end

    let!(:appeals) do
      cases.map do |vacols_case|
        create(:legacy_appeal, :with_root_task, :with_veteran, vacols_case: vacols_case)
      end
    end

    let!(:notifications) do
      appeals.each_with_index do |appeal, index|
        next if [3, 7].include? index

        create(:notification,
               appeals_id: appeal.vacols_id,
               appeals_type: "LegacyAppeal",
               event_date: Time.zone.today,
               event_type: "Appeal docketed",
               notification_type: "Email",
               notified_at: Time.zone.now - (10 - index).minutes,
               email_notification_status: "delivered")
      end
    end

    let!(:make_appeals_outcoded) do
      RootTask.find_by(appeal_id: appeals[5].id).update!(status: "completed", closed_at: 2.days.ago)
      RootTask.find_by(appeal_id: appeals[6].id).update!(status: "completed", closed_at: today)
    end

    let(:first_run_outcoded_appeals) { [appeals[6]] }
    let(:second_run_outcoded_appeals) { [] }
    let(:first_run_never_synced_appeals) { appeals.first(3) + [appeals[4]] + appeals.last(2) }
    let(:second_run_never_synced_appeals) { appeals.last(2) }
    let(:first_run_vbms_document_ids) { [appeals[6].id, appeals[0].id, appeals[1].id, appeals[2].id, appeals[4].id] }
    let(:second_run_vbms_document_ids) { first_run_vbms_document_ids + [appeals[8].id, appeals[9].id, appeals[4].id] }

    before(:all) { ensure_notification_events_exist }
    before(:each) { stub_const("LegacyNotificationEfolderSyncJob::BATCH_LIMIT", BATCH_LIMIT_SIZE) }

    context "first run" do
      after(:all) { clean_up_after_threads }

      it "get all legacy appeals that have been recently outcoded, never been synced, and must be resynced" do
        expect(job.send(:appeals_recently_outcoded)).to match_array(first_run_outcoded_appeals)
        expect(job.send(:appeals_never_synced)).to match_array(first_run_never_synced_appeals)
        expect(job.send(:ready_for_resync)).to eq([])
      end

      it "doesnt sync when appeals have only error notifications" do
        Notification.find_by_appeals_id(appeals[8].vacols_id)
          .update!(event_type: "No Participant Id Found",
                   email_notification_status: "No Participant Id Found",
                   sms_notification_status: "No Participant Id Found")

        Notification.find_by_appeals_id(appeals[9].vacols_id)
          .update!(event_type: "No Participant Id Found",
                   email_notification_status: "No Participant Id Found",
                   sms_notification_status: "No Participant Id Found")

        expect(job.send(:appeals_never_synced).to_a.pluck(:id)).not_to include(8, 9)
      end

      it "does not sync veteran deceased status" do
        create(:vbms_uploaded_document,
               appeal_id: appeals[6].vacols_id,
               attempted_at: 1.day.ago,
               appeal_type: "LegacyAppeal",
               document_type: "BVA Case Notifications")

        create(:notification,
               appeals_id: appeals[6].vacols_id,
               appeals_type: "LegacyAppeal",
               event_date: today,
               event_type: "Appeal docketed",
               notification_type: "Email",
               notified_at: Time.zone.now,
               email_notification_status: "Failure Due to Deceased")

        expect(job.send(:ready_for_resync).to_a).to eq([])
      end

      it "does not sync when all notifications fail" do
        Notification.all.to_a.each do |notif|
          notif.update!(email_notification_status: "No Participant Id Found")
        end

        expect(job.send(:appeals_never_synced)).to eq([])
      end

      it "failed document uploads are still ready to sync" do
        create(:vbms_uploaded_document,
               appeal_id: appeals[4].id,
               attempted_at: today,
               last_submitted_at: today,
               processed_at: today,
               uploaded_to_vbms_at: nil,
               appeal_type: "LegacyAppeal",
               document_type: "BVA Case Notifications")

        create(:notification,
               appeals_id: appeals[4].vacols_id,
               appeals_type: "LegacyAppeal",
               event_date: today,
               event_type: "Appeal docketed",
               notification_type: "Email",
               notified_at: Time.zone.now,
               email_notification_status: "delivered")
        expect(job.send(:ready_for_resync).pluck(:id)).to eq([])
      end

      it "recently outcoded appeals that have new notifications will not be in the ready_to_resync bunket" do
        create(:notification,
               appeals_id: appeals[6].vacols_id,
               appeals_type: "LegacyAppeal",
               event_date: today,
               event_type: "Appeal docketed",
               notification_type: "Email",
               notified_at: Time.zone.now,
               email_notification_status: "delivered")
        expect(job.send(:appeals_recently_outcoded)).to eq([appeals[6]])
        expect(job.send(:ready_for_resync)).to eq([])
      end

      it "running the perform", bypass_cleaner: true do
        perform_enqueued_jobs { LegacyNotificationEfolderSyncJob.perform_later }

        create(:vbms_uploaded_document,
               appeal_id: appeals[4].id,
               attempted_at: 3.days.ago,
               last_submitted_at: 3.days.ago,
               processed_at: 3.days.ago,
               uploaded_to_vbms_at: nil,
               appeal_type: appeals[4].class.name,
               document_type: "BVA Case Notifications")

        create(:notification,
               appeals_id: appeals[6].vacols_id,
               appeals_type: appeals[6].class.name,
               event_date: today,
               event_type: "Appeal decision mailed (Non-contested claims)",
               notification_type: "Email",
               notified_at: Time.zone.now,
               email_notification_status: "delivered")

        expect(find_appeal_ids_from_first_document_sync.size).to eq BATCH_LIMIT_SIZE
      end
    end

    context "second run" do
      # These appeals do not have notifications, or were outcoded too long ago.
      let(:will_not_sync_appeal_ids) { [appeals[3].id, appeals[5].id, appeals[7].id, appeals[6].id] }

      # Gets the appeal IDs for all of the documents created during the first run of the
      # LegacyNotificationEfolderSyncJob
      let(:first_run_vbms_document_appeal_indexes) { find_appeal_ids_from_first_document_sync }

      # There are no more appeals that have been outcoded within the last 24 hours
      let(:second_run_outcoded_appeals) { [] }

      # These appeals will be the ones that have not already been processed but should receive notifications reports.
      let(:second_run_never_synced_appeals_ids) do
        appeals.map(&:id) -
          will_not_sync_appeal_ids -
          first_run_vbms_document_appeal_ids(first_run_vbms_document_appeal_indexes)
      end

      # These appeals should be all that have had notification reports generated for them after two
      # runs with BATCH_LIMIT_SIZE number of appeals processed each time.
      let(:second_run_vbms_document_appeal_ids) do
        first_run_vbms_document_appeal_ids(first_run_vbms_document_appeal_indexes) +
          second_run_never_synced_appeals_ids -
          will_not_sync_appeal_ids
      end

      before do
        ensure_notification_events_exist
        RootTask.find_by(appeal_id: appeals[6].id).update!(closed_at: 25.hours.ago)
      end
      after { clean_up_after_threads }

      it "get all legacy appeals that have been recently outcoded", bypass_cleaner: true do
        perform_enqueued_jobs { LegacyNotificationEfolderSyncJob.perform_later }

        expect(job.send(:appeals_recently_outcoded)).to match_array(second_run_outcoded_appeals)
      end

      it "get all legacy appeals that have never been synced yet", bypass_cleaner: true do
        perform_enqueued_jobs { LegacyNotificationEfolderSyncJob.perform_later }

        expect(
          job.send(:appeals_never_synced).map(&:id)
        ).to match_array(second_run_never_synced_appeals_ids)
      end

      it "get all legacy appeals that must be resynced", bypass_cleaner: true do
        perform_enqueued_jobs { LegacyNotificationEfolderSyncJob.perform_later }

        create(:notification,
               appeals_id: appeals[4].vacols_id,
               appeals_type: "LegacyAppeal",
               event_date: today,
               event_type: "Appeal docketed",
               notification_type: "Email",
               notified_at: 2.minutes.ago,
               email_notification_status: "delivered")

        expect(job.send(:ready_for_resync)).to eq([appeals[4]])
      end

      it "ignore appeals that need to be resynced if latest notification status is " \
        "'Failure Due to Deceased", bypass_cleaner: true do
        perform_enqueued_jobs { LegacyNotificationEfolderSyncJob.perform_later }

        create(:notification,
               appeals_id: appeals[4].vacols_id,
               appeals_type: "LegacyAppeal",
               event_date: today,
               event_type: "Appeal docketed",
               notification_type: "Email",
               notified_at: 1.minute.ago,
               email_notification_status: "Failure Due to Deceased")

        expect(job.send(:ready_for_resync)).to eq([])
      end

      it "running the perform", bypass_cleaner: true do
        perform_enqueued_jobs { LegacyNotificationEfolderSyncJob.perform_later }

        # Appeal at index 4 will be ready for resync
        create(:notification,
               appeals_id: appeals[4].vacols_id,
               appeals_type: "LegacyAppeal",
               event_date: today,
               event_type: "Appeal docketed",
               notification_type: "Email",
               notified_at: Time.zone.now,
               email_notification_status: "delivered")

        perform_enqueued_jobs { LegacyNotificationEfolderSyncJob.perform_later }

        expect(
          VbmsUploadedDocument
            .where(document_type: "BVA Case Notifications")
            .order(:id)
            .pluck(:appeal_id)
        ).to match_array(second_run_vbms_document_appeal_ids + [appeals[4].id])
      end
    end

    def find_appeal_index_by_id(id)
      appeals.map(&:id)&.find_index(id)
    end

    def first_run_vbms_document_appeal_ids(appeal_indexes)
      appeal_indexes.map { |idx| appeals[idx].id }
    end

    def find_appeal_ids_from_first_document_sync
      VbmsUploadedDocument.first(BATCH_LIMIT_SIZE)
        .pluck(:appeal_id)
        .map { |appeal_id| find_appeal_index_by_id(appeal_id) }
        .compact
    end

    def clean_up_after_threads
      DatabaseCleaner.clean_with(:truncation, except: %w[notification_events vftypes issref])
    end

    def ensure_notification_events_exist
      Seeds::NotificationEvents.new.seed! unless NotificationEvent.count > 0
    end
  end
end
