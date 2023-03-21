# frozen_string_literal: true

def env_vars_present?
  ENV["VA_DOT_GOV_API_URL"] && ENV["VA_DOT_GOV_API_KEY"]
end

def use_fake_va_dot_gov_service?
  env_vars_present? ? true : ApplicationController.dependencies_faked?
end

VADotGovService = use_fake_va_dot_gov_service? ? Fakes::VADotGovService : ExternalApi::VADotGovService
