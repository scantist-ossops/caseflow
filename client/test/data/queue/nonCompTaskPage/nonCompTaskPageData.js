/* eslint-disable max-lines */
const completedHLRTaskData = {
  businessLine: 'Veterans Health Administration',
  businessLineUrl: 'vha',
  baseTasksUrl: '/decision_reviews/vha',
  taskFilterDetails: {
    in_progress: {},
    completed: {
      '["DecisionReviewTask", "HigherLevelReview"]': 3,
      '["DecisionReviewTask", "SupplementalClaim"]': 1
    }
  },
  task: {
    claimant: {
      name: 'Bob Smithgreen',
      relationship: 'self'
    },
    appeal: {
      id: '17',
      isLegacyAppeal: false,
      issueCount: 1,
      activeRequestIssues: [
        {
          id: 3710,
          rating_issue_reference_id: null,
          rating_issue_profile_date: null,
          rating_decision_reference_id: null,
          description: 'Beneficiary Travel - sdad',
          contention_text: 'Beneficiary Travel - sdad',
          approx_decision_date: '2023-03-30',
          category: 'Beneficiary Travel',
          notes: null,
          is_unidentified: null,
          ramp_claim_id: null,
          vacols_id: null,
          vacols_sequence_id: null,
          ineligible_reason: null,
          ineligible_due_to_id: null,
          decision_review_title: 'Higher-Level Review',
          title_of_active_review: null,
          contested_decision_issue_id: null,
          withdrawal_date: null,
          contested_issue_description: null,
          end_product_code: null,
          end_product_establishment_code: null,
          verified_unidentified_issue: null,
          editable: true,
          exam_requested: null,
          vacols_issue: null,
          end_product_cleared: null,
          benefit_type: 'vha',
          is_predocket_needed: null
        }
      ],
      appellant_type: null
    },
    power_of_attorney: {
      representative_type: 'Attorney',
      representative_name: 'Clarence Darrow',
      representative_address: {
        address_line_1: '9999 MISSION ST',
        address_line_2: 'UBER',
        address_line_3: 'APT 2',
        city: 'SAN FRANCISCO',
        zip: '94103',
        country: 'USA',
        state: 'CA'
      },
      representative_email_address: 'jamie.fakerton@caseflowdemo.com'
    },
    appellant_type: null,
    issue_count: 1,
    tasks_url: '/decision_reviews/vha',
    id: 10467,
    created_at: '2023-05-01T12:54:22.123-04:00',
    veteran_participant_id: '253956744',
    veteran_ssn: '800124578',
    assigned_on: '2023-05-01T12:54:22.123-04:00',
    assigned_at: '2023-05-01T12:54:22.123-04:00',
    closed_at: '2023-05-01T13:25:21.367-04:00',
    started_at: null,
    type: 'Higher-Level Review',
    business_line: 'vha'
  },
  appeal: {
    claimant: '253956744',
    claimantType: 'veteran',
    claimantName: 'Bob Smithgreen',
    veteranIsNotClaimant: false,
    processedInCaseflow: true,
    legacyOptInApproved: false,
    legacyAppeals: [],
    ratings: null,
    editIssuesUrl: '/higher_level_reviews/26e2dc68-c3c6-484d-8cfd-5075792d6eb9/edit',
    processedAt: null,
    veteranInvalidFields: {
      veteran_missing_fields: [],
      veteran_address_too_long: false,
      veteran_address_invalid_fields: false,
      veteran_city_invalid_fields: false,
      veteran_city_too_long: false,
      veteran_date_of_birth_invalid: false,
      veteran_name_suffix_invalid: false,
      veteran_zip_code_invalid: false,
      veteran_pay_grade_invalid: false
    },
    requestIssues: [
      {
        id: 3710,
        rating_issue_reference_id: null,
        rating_issue_profile_date: null,
        rating_decision_reference_id: null,
        description: 'Beneficiary Travel - sdad',
        contention_text: 'Beneficiary Travel - sdad',
        approx_decision_date: '2023-03-30',
        category: 'Beneficiary Travel',
        notes: null,
        is_unidentified: null,
        ramp_claim_id: null,
        vacols_id: null,
        vacols_sequence_id: null,
        ineligible_reason: null,
        ineligible_due_to_id: null,
        decision_review_title: 'Higher-Level Review',
        title_of_active_review: null,
        contested_decision_issue_id: null,
        withdrawal_date: null,
        contested_issue_description: null,
        end_product_code: null,
        end_product_establishment_code: null,
        verified_unidentified_issue: null,
        editable: true,
        exam_requested: null,
        vacols_issue: null,
        end_product_cleared: null,
        benefit_type: 'vha',
        is_predocket_needed: null
      }
    ],
    decisionIssues: [
      {
        id: 756,
        description: 'granted',
        disposition: 'Granted',
        approxDecisionDate: '2023-04-01',
        requestIssueId: 3710
      }
    ],
    activeNonratingRequestIssues: [
      {
        id: 3708,
        rating_issue_reference_id: null,
        rating_issue_profile_date: null,
        rating_decision_reference_id: null,
        description: 'Entitlement | Parent - test',
        contention_text: 'Entitlement | Parent - test',
        approx_decision_date: '2023-04-18',
        category: 'Entitlement | Parent',
        notes: null,
        is_unidentified: null,
        ramp_claim_id: null,
        vacols_id: null,
        vacols_sequence_id: null,
        ineligible_reason: null,
        ineligible_due_to_id: null,
        decision_review_title: 'Higher-Level Review',
        title_of_active_review: null,
        contested_decision_issue_id: null,
        withdrawal_date: null,
        contested_issue_description: null,
        end_product_code: null,
        end_product_establishment_code: null,
        verified_unidentified_issue: null,
        editable: true,
        exam_requested: null,
        vacols_issue: null,
        end_product_cleared: null,
        benefit_type: 'nca',
        is_predocket_needed: null
      },
      {
        id: 3707,
        rating_issue_reference_id: null,
        rating_issue_profile_date: null,
        rating_decision_reference_id: null,
        description: 'Continuing Eligibility/Income Verification Match (IVM) - ad',
        contention_text: 'Continuing Eligibility/Income Verification Match (IVM) - ad',
        approx_decision_date: '2023-04-04',
        category: 'Continuing Eligibility/Income Verification Match (IVM)',
        notes: null,
        is_unidentified: null,
        ramp_claim_id: null,
        vacols_id: null,
        vacols_sequence_id: null,
        ineligible_reason: null,
        ineligible_due_to_id: null,
        decision_review_title: 'Higher-Level Review',
        title_of_active_review: null,
        contested_decision_issue_id: null,
        withdrawal_date: null,
        contested_issue_description: null,
        end_product_code: null,
        end_product_establishment_code: null,
        verified_unidentified_issue: null,
        editable: true,
        exam_requested: null,
        vacols_issue: null,
        end_product_cleared: null,
        benefit_type: 'vha',
        is_predocket_needed: null
      },
      {
        id: 3706,
        rating_issue_reference_id: null,
        rating_issue_profile_date: null,
        rating_decision_reference_id: null,
        description: 'Testerereaa',
        contention_text: 'Testerereaa',
        approx_decision_date: '2023-04-03',
        category: 'Other',
        notes: null,
        is_unidentified: null,
        ramp_claim_id: null,
        vacols_id: null,
        vacols_sequence_id: null,
        ineligible_reason: null,
        ineligible_due_to_id: null,
        decision_review_title: 'Supplemental Claim',
        title_of_active_review: null,
        contested_decision_issue_id: 753,
        withdrawal_date: null,
        contested_issue_description: 'Testerereaa',
        end_product_code: null,
        end_product_establishment_code: null,
        verified_unidentified_issue: null,
        editable: true,
        exam_requested: null,
        vacols_issue: null,
        end_product_cleared: null,
        benefit_type: 'vha',
        is_predocket_needed: null
      },
      {
        id: 3705,
        rating_issue_reference_id: null,
        rating_issue_profile_date: null,
        rating_decision_reference_id: null,
        description: 'Other - test',
        contention_text: 'Other - test',
        approx_decision_date: '2023-03-30',
        category: 'Other',
        notes: null,
        is_unidentified: null,
        ramp_claim_id: null,
        vacols_id: null,
        vacols_sequence_id: null,
        ineligible_reason: null,
        ineligible_due_to_id: null,
        decision_review_title: 'Higher-Level Review',
        title_of_active_review: null,
        contested_decision_issue_id: null,
        withdrawal_date: null,
        contested_issue_description: null,
        end_product_code: null,
        end_product_establishment_code: null,
        verified_unidentified_issue: null,
        editable: true,
        exam_requested: null,
        vacols_issue: null,
        end_product_cleared: null,
        benefit_type: 'vha',
        is_predocket_needed: null
      },
      {
        id: 3699,
        rating_issue_reference_id: null,
        rating_issue_profile_date: null,
        rating_decision_reference_id: null,
        description: 'Other Non-Rated - test',
        contention_text: 'Other Non-Rated - test',
        approx_decision_date: '2023-04-26',
        category: 'Other Non-Rated',
        notes: null,
        is_unidentified: null,
        ramp_claim_id: null,
        vacols_id: null,
        vacols_sequence_id: null,
        ineligible_reason: null,
        ineligible_due_to_id: null,
        decision_review_title: 'Higher-Level Review',
        title_of_active_review: null,
        contested_decision_issue_id: null,
        withdrawal_date: null,
        contested_issue_description: null,
        end_product_code: '030HLRNR',
        end_product_establishment_code: '030HLRNR',
        verified_unidentified_issue: null,
        editable: true,
        exam_requested: null,
        vacols_issue: null,
        end_product_cleared: false,
        benefit_type: 'compensation',
        is_predocket_needed: null
      },
      {
        id: 3697,
        rating_issue_reference_id: null,
        rating_issue_profile_date: null,
        rating_decision_reference_id: null,
        description: 'Prosthetics | Other (not clothing allowance) - test',
        contention_text: 'Prosthetics | Other (not clothing allowance) - test',
        approx_decision_date: '2023-04-12',
        category: 'Prosthetics | Other (not clothing allowance)',
        notes: null,
        is_unidentified: null,
        ramp_claim_id: null,
        vacols_id: null,
        vacols_sequence_id: null,
        ineligible_reason: null,
        ineligible_due_to_id: null,
        decision_review_title: 'Appeal',
        title_of_active_review: null,
        contested_decision_issue_id: null,
        withdrawal_date: null,
        contested_issue_description: null,
        end_product_code: null,
        end_product_establishment_code: null,
        verified_unidentified_issue: null,
        editable: true,
        exam_requested: null,
        vacols_issue: null,
        end_product_cleared: null,
        benefit_type: 'vha',
        is_predocket_needed: true
      }
    ],
    contestableIssuesByDate: [
      {
        ratingIssueReferenceId: null,
        ratingIssueProfileDate: null,
        ratingIssueDiagnosticCode: null,
        ratingDecisionReferenceId: null,
        decisionIssueId: 756,
        approxDecisionDate: '2023-04-01',
        description: 'granted',
        rampClaimId: null,
        titleOfActiveReview: null,
        sourceReviewType: null,
        timely: true,
        latestIssuesInChain: [
          {
            id: 756,
            approxDecisionDate: '2023-04-01'
          }
        ],
        isRating: false
      },
    ],
    intakeUser: 'ACBAUERVVHAH',
    relationships: [
      {
        participant_id: 'CLAIMANT_WITH_PVA_AS_VSO',
        first_name: 'BOB',
        last_name: 'VANCE',
        relationship_type: 'Spouse',
        default_payee_code: '10'
      },
      {
        participant_id: '1129318238',
        first_name: 'CATHY',
        last_name: 'SMITH',
        relationship_type: 'Child',
        default_payee_code: '11'
      },
      {
        participant_id: 'no-such-pid',
        first_name: 'TOM',
        last_name: 'BRADY',
        relationship_type: 'Child',
        default_payee_code: '11'
      }
    ],
    veteranValid: true,
    receiptDate: '2023/04/03',
    veteran: {
      name: 'Bob Smithgreen',
      fileNumber: '000100000',
      formName: 'Smithgreen, Bob',
      ssn: '800124578'
    },
    powerOfAttorneyName: 'Clarence Darrow',
    claimantRelationship: 'Veteran',
    asyncJobUrl: '/asyncable_jobs/HigherLevelReview/jobs/17',
    benefitType: 'vha',
    payeeCode: null,
    hasClearedRatingEp: false,
    hasClearedNonratingEp: false,
    informalConference: false,
    sameOffice: null,
    formType: 'higher_level_review'
  },
  selectedTask: null,
  decisionIssuesStatus: {},
  powerOfAttorneyName: null,
  poaAlert: {},
  featureToggles: {
    decisionReviewQueueSsnColumn: true
  },
  loadingPowerOfAttorney: {
    loading: false
  },
  ui: {
    featureToggles: {
      poa_button_refresh: true
    }
  },
};


export const completeTaskPageData = {
  serverNonComp: {
    ...completedHLRTaskData
  },
};

export const inProgressTaskPageData = {
  serverNonComp: {
    ...completedHLRTaskData,
    [Object.keys(completedHLRTaskData)[4]]: {
      ...Object.values(completedHLRTaskData)[4],
      closed_at: null,
    },
    [Object.keys(completedHLRTaskData)[5]]: {
      ...Object.values(completedHLRTaskData)[5],
      decisionIssues: [],
      contestableIssuesByDate: [],
    }
  },
};
/* eslint-enable max-len */
