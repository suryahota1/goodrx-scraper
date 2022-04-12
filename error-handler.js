const ErrorHandler = {
    "MESSAGE": {
        "INVALID_INPUT": "Not a valid URL",
        "SECURE_CONNECTION_ISSUE": "Secure connection issue",
        "NETWORK_CONNECTIVITY_ISSUE": "Network connection failed. Please check internet connectivity.",
        "PROXY_CONNECTIVITY_ISSUE": "Proxy connection failed",
        "BLOCKED_OUTSIDE_US": "IP is blocked outside USA",
        "BLOCKED_IP": "IP is blocked, Got BOT message",
        "NO_DATA_AVAILABLE": "Data is not available",
        "COLUMN_MISMATCH": "Column ID or drug_name is missing in the Input file",
        "BROWSER_LAUNCH_FAIL": "Failed to launch browser",
        "NO_DATA_TO_SCRAPE": "No input data available for scraping",
        "NO_SUCH_EVENT": "No such event available, Please define the event first",
        "ZIP_SET_FAILED": "Zipcode set failed",
        "NOT_A_VALID_ZIP": "Not a valid zip code",
        "LICENSE_VALIDATION_FAILED": "License validation failed",
        "ZIP_SET_BUTTON_NOT_FOUND": "No HTML selector found for setting zip code",
        "ZIP_SET_INPUT_NOT_FOUND": "No input element found for setting zip code",
        "ZIP_SET_SUBMIT_BUTTON_NOT_FOUND": "Submit button not found for setting zip code",
        "INVALID_ZIP_CODE_FORMAT": "Zipcode format is not correct",
        "FILTER_DROPDOWN_DIDNOT_OPEN": "Filter drop-down didn't open on click",
        "FILTER_OPTIONS_NOT_AVAILABLE": "Filter options not available",
        "FILTER_OPTIONS_CLICK_DIDNOT_WORK": "After clicking filter option API didn't get triggered",

        "VALID_LOC_TEXT": "Must be a valid location in the United States",
        "SET_LOC_TEXT": "Set your location",

        "DRUG_DISCONTINUED": "Drug is either discontinued or not yet available",
        "DRUG_PRICE_NOT_AVAILABLE": "No price found for this drug at selected location"
    },
    "CODE": {
        "BAD_DATA": 400,
        "CONNECTION_FORBIDDEN": 403,
        "DATA_NOT_FOUND": 404,
        "CONNECTION_ISSUE": 431,
        "PROXY_CONNECTION_ISSUE": 435,
        "NO_DATA": 423,
        "ZIP_SET_FAILED": 456,
        "DATA_SET_FAILURE": 478,
        "INVALID_OUTPUT_DIRECTORY": 479,
        "OUTPUT_DIRECTORY_EXISTS": 480,
        "MISSING_OUTPUT_FILE": 481,
        "NO_SUCH_EVENT": 501,
        "LICENSE_VALIDATION_FAILED": 482,
        "ZIP_SET_BUTTON_NOT_FOUND": 510,
        "UNRESPONSIVE_CLICK": 532,

        "DRUG_DISCONTINUED": 601,
        "DRUG_PRICE_NOT_AVAILABLE": 602
    },
    "SERVER_MESSAGE": {
        "ERR_EMPTY_RESPONSE": "ERR_EMPTY_RESPONSE",
        "ERR_CERT_AUTHORITY_INVALID": "ERR_CERT_AUTHORITY_INVALID",
        "ERR_HTTP_RESPONSE_CODE_FAILURE": "ERR_HTTP_RESPONSE_CODE_FAILURE",
        "ERR_PROXY_CONNECTION_FAILED": "ERR_PROXY_CONNECTION_FAILED",
        "ERR_NO_SUPPORTED_PROXIES": "ERR_NO_SUPPORTED_PROXIES",
        "ERR_TIMED_OUT": "ERR_TIMED_OUT",
        "ERR_NETWORK_CHANGED": "ERR_NETWORK_CHANGED"
    }
};

module.exports = ErrorHandler;
