module.exports = Object.freeze({
    "quantitySettingParEle": "#uat-dropdown-container-quantity div",
    "dosageSettingParEle": "#uat-dropdown-container-dosage div",
    "formSettingParEle": "#uat-dropdown-container-form div",
    "brandSettingParEle": "#uat-dropdown-container-brand div",
    "filterDisabledClassName": "btn_disabled",
    "no_loc_set_btn": "[data-qa='set_location_button']",
    "after_loc_set_btn": "[data-qa='location_element_after_setting_location']",
    "zip_set_input_field": "#locationModalInput",
    "zip_code_submit_button": "#uat-location-submit",
    "page_loader": "#modal-",
    "page_loader_hidden_validator": 'document.getElementById("modal-") === null',
    "quantity_enabled_selector": 'document.querySelector("#uat-dropdown-container-quantity").getAttribute("class")',
    "dosage_enabled_selector": 'document.querySelector("#uat-dropdown-container-dosage").getAttribute("class")',
    "form_enabled_selector": 'document.querySelector("#uat-dropdown-container-form").getAttribute("class")',
    "label_enabled_selector": 'document.querySelector("#uat-dropdown-container-brand").getAttribute("class")',
    "quantity_options_selector": "#uat-dropdown-container-quantity~div ul li",
    "dosage_options_selector": "#uat-dropdown-container-dosage~div ul li",
    "form_options_selector": "#uat-dropdown-container-form~div ul li",
    "brand_options_selector": "#uat-dropdown-container-brand~div ul li",
    "filter_dropdown_common_selector": "[data-qa$='dropdown_ctn']",
    "click_on_body_selector": 'document.querySelector("body").click()',
    "filterSettingsRowContainerSelector": "[data-qa='prescription_settings_ctn']",
    "searchDropdown": "[aria-label='Supplementary Search Navigation']",
    "couponTabSelector": "[data-qa='coupons_tab_subtitle']",
    "noticeRowSelector": "[data-qa='notice_description_txt']",
    "discontinuedDrugSelector": "[data-qa='discontinued_drug_ctn']",
    "prescriptionSettingsBtnSelector": "[data-qa='prescription_settings_ctn'] > div",
    "contactPersonModalSelector": "#contactable-persons-modal",
    "contactPersonModalCloseButtonSelector": "[data-qa='modal_close_btn_contactable-persons-modal']",
    "botMessageTextVal": "Please verify you are a human"
});