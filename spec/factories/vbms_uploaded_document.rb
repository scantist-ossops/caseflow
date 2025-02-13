# frozen_string_literal: true

FactoryBot.define do
  factory :vbms_uploaded_document do
    veteran_file_number { generate :veteran_file_number }
    document_type { "Status Letter" }
    appeal { create(:appeal) }

    document_version_reference_id { "{#{SecureRandom.uuid.upcase}}" }
    document_series_reference_id { "{#{SecureRandom.uuid.upcase}}" }

    trait :for_legacy_appeal do
      appeal { create(:legacy_appeal, vacols_case: create(:case)) }
    end
  end
end
