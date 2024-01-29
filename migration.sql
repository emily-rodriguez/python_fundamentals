alter table "public"."address" alter column "_created_at" set default now();
alter table "public"."address" alter column "_created_at" set not null;

alter table "public"."alias" alter column "_created_at" set default now();
alter table "public"."alias" alter column "_created_at" set not null;

alter table "public"."amortization" alter column "_created_at" set default now();
alter table "public"."amortization" alter column "_created_at" set not null;

alter table "public"."amortization_schedule" alter column "_created_at" set default now();
alter table "public"."amortization_schedule" alter column "_created_at" set not null;

alter table "public"."application" alter column "_created_at" set default now();
alter table "public"."application" alter column "_created_at" set not null;

alter table "public"."asset" alter column "_created_at" set default now();
alter table "public"."asset" alter column "_created_at" set not null;

alter table "public"."assigned_asian_types" alter column "_created_at" set default now();
alter table "public"."assigned_asian_types" alter column "_created_at" set not null;

alter table "public"."assigned_credit_decision_reasons" alter column "_created_at" set default now();
alter table "public"."assigned_credit_decision_reasons" alter column "_created_at" set not null;

alter table "public"."assigned_ethnicity_types" alter column "_created_at" set default now();
alter table "public"."assigned_ethnicity_types" alter column "_created_at" set not null;

alter table "public"."assigned_hispanic_origin_types" alter column "_created_at" set default now();
alter table "public"."assigned_hispanic_origin_types" alter column "_created_at" set not null;

alter table "public"."assigned_race_types" alter column "_created_at" set default now();
alter table "public"."assigned_race_types" alter column "_created_at" set not null;

alter table "public"."assigned_user_roles" alter column "_created_at" set default now();
alter table "public"."assigned_user_roles" alter column "_created_at" set not null;

alter table "public"."buyer_profile" alter column "_created_at" set default now();
alter table "public"."buyer_profile" alter column "_created_at" set not null;

alter table "public"."cmt_rate" alter column "_created_at" set default now();
alter table "public"."cmt_rate" alter column "_created_at" set not null;

alter table "public"."company" alter column "_created_at" set default now();
alter table "public"."company" alter column "_created_at" set not null;

alter table "public"."company_assigned_documents" alter column "_created_at" set default now();
alter table "public"."company_assigned_documents" alter column "_created_at" set not null;

alter table "public"."company_assigned_roles" alter column "_created_at" set default now();
alter table "public"."company_assigned_roles" alter column "_created_at" set not null;

alter table "public"."condition" alter column "_created_at" set default now();
alter table "public"."condition" alter column "_created_at" set not null;

alter table "public"."condition_assigned_docs" alter column "_created_at" set default now();
alter table "public"."condition_assigned_docs" alter column "_created_at" set not null;

alter table "public"."credit_decision" alter column "_created_at" set default now();
alter table "public"."credit_decision" alter column "_created_at" set not null;

alter table "public"."credit_decision_factors" alter column "_created_at" set default now();
alter table "public"."credit_decision_factors" alter column "_created_at" set not null;

alter table "public"."credit_decision_reason" alter column "_created_at" set default now();
alter table "public"."credit_decision_reason" alter column "_created_at" set not null;

alter table "public"."credit_product" alter column "_created_at" set default now();
alter table "public"."credit_product" alter column "_created_at" set not null;

alter table "public"."credit_response" alter column "_created_at" set default now();
alter table "public"."credit_response" alter column "_created_at" set not null;

alter table "public"."deal" alter column "_created_at" set default now();
alter table "public"."deal" alter column "_created_at" set not null;

alter table "public"."deal_assigned_parties" alter column "_created_at" set default now();
alter table "public"."deal_assigned_parties" alter column "_created_at" set not null;

alter table "public"."deal_assigned_tasks" alter column "_created_at" set default now();
alter table "public"."deal_assigned_tasks" alter column "_created_at" set not null;

alter table "public"."deal_metadata" alter column "_created_at" set default now();
alter table "public"."deal_metadata" alter column "_created_at" set not null;

alter table "public"."deal_party_progress" alter column "_created_at" set default now();
alter table "public"."deal_party_progress" alter column "_created_at" set not null;

alter table "public"."deal_property_relation" alter column "_created_at" set default now();
alter table "public"."deal_property_relation" alter column "_created_at" set not null;

alter table "public"."dealer_details" alter column "_created_at" set default now();
alter table "public"."dealer_details" alter column "_created_at" set not null;

alter table "public"."dealer_schedule" alter column "_created_at" set default now();
alter table "public"."dealer_schedule" alter column "_created_at" set not null;

alter table "public"."declarations" alter column "_created_at" set default now();
alter table "public"."declarations" alter column "_created_at" set not null;

alter table "public"."demographic" alter column "_created_at" set default now();
alter table "public"."demographic" alter column "_created_at" set not null;

alter table "public"."dit_response" alter column "_created_at" set default now();
alter table "public"."dit_response" alter column "_created_at" set not null;

alter table "public"."document" alter column "_created_at" set default now();
alter table "public"."document" alter column "_created_at" set not null;

alter table "public"."down_payment" alter column "_created_at" set default now();
alter table "public"."down_payment" alter column "_created_at" set not null;

alter table "public"."employment" alter column "_created_at" set default now();
alter table "public"."employment" alter column "_created_at" set not null;

alter table "public"."expense" alter column "_created_at" set default now();
alter table "public"."expense" alter column "_created_at" set not null;

alter table "public"."fake_pii_mask_data" alter column "_created_at" set default now();
alter table "public"."fake_pii_mask_data" alter column "_created_at" set not null;

alter table "public"."fees" alter column "_created_at" set default now();
alter table "public"."fees" alter column "_created_at" set not null;

alter table "public"."home" alter column "_created_at" set default now();
alter table "public"."home" alter column "_created_at" set not null;

alter table "public"."income" alter column "_created_at" set default now();
alter table "public"."income" alter column "_created_at" set not null;

alter table "public"."insurance_product" alter column "_created_at" set default now();
alter table "public"."insurance_product" alter column "_created_at" set not null;

alter table "public"."investor_participation" alter column "_created_at" set default now();
alter table "public"."investor_participation" alter column "_created_at" set not null;

alter table "public"."investor_program" alter column "_created_at" set default now();
alter table "public"."investor_program" alter column "_created_at" set not null;

alter table "public"."liability" alter column "_created_at" set default now();
alter table "public"."liability" alter column "_created_at" set not null;

alter table "public"."loan" alter column "_created_at" set default now();
alter table "public"."loan" alter column "_created_at" set not null;

alter table "public"."lut_address_type" alter column "_created_at" set default now();
alter table "public"."lut_address_type" alter column "_created_at" set not null;

alter table "public"."lut_amortization_schedule_type" alter column "_created_at" set default now();
alter table "public"."lut_amortization_schedule_type" alter column "_created_at" set not null;

alter table "public"."lut_amortization_type" alter column "_created_at" set default now();
alter table "public"."lut_amortization_type" alter column "_created_at" set not null;

alter table "public"."lut_application_section" alter column "_created_at" set default now();
alter table "public"."lut_application_section" alter column "_created_at" set not null;

alter table "public"."lut_asset_category" alter column "_created_at" set default now();
alter table "public"."lut_asset_category" alter column "_created_at" set not null;

alter table "public"."lut_asset_type" alter column "_created_at" set default now();
alter table "public"."lut_asset_type" alter column "_created_at" set not null;

alter table "public"."lut_assistance_type" alter column "_created_at" set default now();
alter table "public"."lut_assistance_type" alter column "_created_at" set not null;

alter table "public"."lut_citizenship_type" alter column "_created_at" set default now();
alter table "public"."lut_citizenship_type" alter column "_created_at" set not null;

alter table "public"."lut_company_role" alter column "_created_at" set default now();
alter table "public"."lut_company_role" alter column "_created_at" set not null;

alter table "public"."lut_company_type" alter column "_created_at" set default now();
alter table "public"."lut_company_type" alter column "_created_at" set not null;

alter table "public"."lut_condition_type" alter column "_created_at" set default now();
alter table "public"."lut_condition_type" alter column "_created_at" set not null;

alter table "public"."lut_contact_point_role" alter column "_created_at" set default now();
alter table "public"."lut_contact_point_role" alter column "_created_at" set not null;

alter table "public"."lut_county" alter column "_created_at" set default now();
alter table "public"."lut_county" alter column "_created_at" set not null;

alter table "public"."lut_credit_impact" alter column "_created_at" set default now();
alter table "public"."lut_credit_impact" alter column "_created_at" set not null;

alter table "public"."lut_decision_type" alter column "_created_at" set default now();
alter table "public"."lut_decision_type" alter column "_created_at" set not null;

alter table "public"."lut_disposition_status" alter column "_created_at" set default now();
alter table "public"."lut_disposition_status" alter column "_created_at" set not null;

alter table "public"."lut_document_type" alter column "_created_at" set default now();
alter table "public"."lut_document_type" alter column "_created_at" set not null;

alter table "public"."lut_employment_classification" alter column "_created_at" set default now();
alter table "public"."lut_employment_classification" alter column "_created_at" set not null;

alter table "public"."lut_employment_standing" alter column "_created_at" set default now();
alter table "public"."lut_employment_standing" alter column "_created_at" set not null;

alter table "public"."lut_ethnicity_hispanic_origin_type" alter column "_created_at" set default now();
alter table "public"."lut_ethnicity_hispanic_origin_type" alter column "_created_at" set not null;

alter table "public"."lut_ethnicity_type" alter column "_created_at" set default now();
alter table "public"."lut_ethnicity_type" alter column "_created_at" set not null;

alter table "public"."lut_expense_category" alter column "_created_at" set default now();
alter table "public"."lut_expense_category" alter column "_created_at" set not null;

alter table "public"."lut_expense_type" alter column "_created_at" set default now();
alter table "public"."lut_expense_type" alter column "_created_at" set not null;

alter table "public"."lut_fee_type" alter column "_created_at" set default now();
alter table "public"."lut_fee_type" alter column "_created_at" set not null;

alter table "public"."lut_funds_category" alter column "_created_at" set default now();
alter table "public"."lut_funds_category" alter column "_created_at" set not null;

alter table "public"."lut_funds_source" alter column "_created_at" set default now();
alter table "public"."lut_funds_source" alter column "_created_at" set not null;

alter table "public"."lut_funds_type" alter column "_created_at" set default now();
alter table "public"."lut_funds_type" alter column "_created_at" set not null;

alter table "public"."lut_gender_type" alter column "_created_at" set default now();
alter table "public"."lut_gender_type" alter column "_created_at" set not null;

alter table "public"."lut_geo_state" alter column "_created_at" set default now();
alter table "public"."lut_geo_state" alter column "_created_at" set not null;

alter table "public"."lut_home_condition" alter column "_created_at" set default now();
alter table "public"."lut_home_condition" alter column "_created_at" set not null;

alter table "public"."lut_home_model" alter column "_created_at" set default now();
alter table "public"."lut_home_model" alter column "_created_at" set not null;

alter table "public"."lut_income_category" alter column "_created_at" set default now();
alter table "public"."lut_income_category" alter column "_created_at" set not null;

alter table "public"."lut_income_type" alter column "_created_at" set default now();
alter table "public"."lut_income_type" alter column "_created_at" set not null;

alter table "public"."lut_land_disposition" alter column "_created_at" set default now();
alter table "public"."lut_land_disposition" alter column "_created_at" set not null;

alter table "public"."lut_liability_category" alter column "_created_at" set default now();
alter table "public"."lut_liability_category" alter column "_created_at" set not null;

alter table "public"."lut_liability_type" alter column "_created_at" set default now();
alter table "public"."lut_liability_type" alter column "_created_at" set not null;

alter table "public"."lut_loan_purpose" alter column "_created_at" set default now();
alter table "public"."lut_loan_purpose" alter column "_created_at" set not null;

alter table "public"."lut_loan_type" alter column "_created_at" set default now();
alter table "public"."lut_loan_type" alter column "_created_at" set not null;

alter table "public"."lut_manufacturer" alter column "_created_at" set default now();
alter table "public"."lut_manufacturer" alter column "_created_at" set not null;

alter table "public"."lut_marital_status" alter column "_created_at" set default now();
alter table "public"."lut_marital_status" alter column "_created_at" set not null;

alter table "public"."lut_mortgage_type" alter column "_created_at" set default now();
alter table "public"."lut_mortgage_type" alter column "_created_at" set not null;

alter table "public"."lut_owned_property_status" alter column "_created_at" set default now();
alter table "public"."lut_owned_property_status" alter column "_created_at" set not null;

alter table "public"."lut_ownership_interest" alter column "_created_at" set default now();
alter table "public"."lut_ownership_interest" alter column "_created_at" set not null;

alter table "public"."lut_party_role" alter column "_created_at" set default now();
alter table "public"."lut_party_role" alter column "_created_at" set not null;

alter table "public"."lut_position_type" alter column "_created_at" set default now();
alter table "public"."lut_position_type" alter column "_created_at" set not null;

alter table "public"."lut_program_type" alter column "_created_at" set default now();
alter table "public"."lut_program_type" alter column "_created_at" set not null;

alter table "public"."lut_race_asian_type" alter column "_created_at" set default now();
alter table "public"."lut_race_asian_type" alter column "_created_at" set not null;

alter table "public"."lut_race_type" alter column "_created_at" set default now();
alter table "public"."lut_race_type" alter column "_created_at" set not null;

alter table "public"."lut_residency_basis" alter column "_created_at" set default now();
alter table "public"."lut_residency_basis" alter column "_created_at" set not null;

alter table "public"."lut_sections" alter column "_created_at" set default now();
alter table "public"."lut_sections" alter column "_created_at" set not null;

alter table "public"."lut_site_disposition" alter column "_created_at" set default now();
alter table "public"."lut_site_disposition" alter column "_created_at" set not null;

alter table "public"."lut_special_employer_classification" alter column "_created_at" set default now();
alter table "public"."lut_special_employer_classification" alter column "_created_at" set not null;

alter table "public"."lut_submission_result_response" alter column "_created_at" set default now();
alter table "public"."lut_submission_result_response" alter column "_created_at" set not null;

alter table "public"."lut_task_role" alter column "_created_at" set default now();
alter table "public"."lut_task_role" alter column "_created_at" set not null;

alter table "public"."lut_task_type" alter column "_created_at" set default now();
alter table "public"."lut_task_type" alter column "_created_at" set not null;

alter table "public"."lut_tax_rate" alter column "_created_at" set default now();
alter table "public"."lut_tax_rate" alter column "_created_at" set not null;

alter table "public"."lut_taxing_unit" alter column "_created_at" set default now();
alter table "public"."lut_taxing_unit" alter column "_created_at" set not null;

alter table "public"."lut_term_length" alter column "_created_at" set default now();
alter table "public"."lut_term_length" alter column "_created_at" set not null;

alter table "public"."lut_unit_type" alter column "_created_at" set default now();
alter table "public"."lut_unit_type" alter column "_created_at" set not null;

alter table "public"."lut_usage_type" alter column "_created_at" set default now();
alter table "public"."lut_usage_type" alter column "_created_at" set not null;

alter table "public"."lut_user_role" alter column "_created_at" set default now();
alter table "public"."lut_user_role" alter column "_created_at" set not null;

alter table "public"."mask_pii_data" alter column "_created_at" set default now();
alter table "public"."mask_pii_data" alter column "_created_at" set not null;

alter table "public"."offers" alter column "_created_at" set default now();
alter table "public"."offers" alter column "_created_at" set not null;

alter table "public"."owned_property" alter column "_created_at" set default now();
alter table "public"."owned_property" alter column "_created_at" set not null;

alter table "public"."package" alter column "_created_at" set default now();
alter table "public"."package" alter column "_created_at" set not null;

alter table "public"."party" alter column "_created_at" set default now();
alter table "public"."party" alter column "_created_at" set not null;

alter table "public"."person" alter column "_created_at" set default now();
alter table "public"."person" alter column "_created_at" set not null;

alter table "public"."person_assigned_tasks" alter column "_created_at" set default now();
alter table "public"."person_assigned_tasks" alter column "_created_at" set not null;

alter table "public"."position" alter column "_created_at" set default now();
alter table "public"."position" alter column "_created_at" set not null;

alter table "public"."price_predictions" alter column "_created_at" set default now();
alter table "public"."price_predictions" alter column "_created_at" set not null;

alter table "public"."property" alter column "_created_at" set default now();
alter table "public"."property" alter column "_created_at" set not null;

alter table "public"."residence" alter column "_created_at" set default now();
alter table "public"."residence" alter column "_created_at" set not null;

alter table "public"."system_state" alter column "_created_at" set default now();
alter table "public"."system_state" alter column "_created_at" set not null;

alter table "public"."system_state_log" alter column "_created_at" set default now();
alter table "public"."system_state_log" alter column "_created_at" set not null;

alter table "public"."task" alter column "_created_at" set default now();
alter table "public"."task" alter column "_created_at" set not null;

alter table "public"."task_assigned_docs" alter column "_created_at" set default now();
alter table "public"."task_assigned_docs" alter column "_created_at" set not null;

alter table "public"."terms_of_loan" alter column "_created_at" set default now();
alter table "public"."terms_of_loan" alter column "_created_at" set not null;

alter table "public"."verification" alter column "_created_at" set default now();
alter table "public"."verification" alter column "_created_at" set not null;

