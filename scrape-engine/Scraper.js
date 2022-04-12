const ErrorHandler = require("../error-handler");
const { ScrapingError } = require("../ErrorTypes");
const Constants = require('./../constants');
const InternetAvailable = require("internet-available");
const Utility = require('../Utility');
const EventTracker = require('../EventTracker');
const HTMLSelectors = require('../html-selectors');

class Scraper {

    page;
    url;
    metaData;
    zipCode;
    zipCodeSetInvokeCount;
    eventTracker;
    httpTracker;

    constructor ( page, url, zipCode, metaData, httpRef ) {
        this.page = page;
        this.url = url;
        this.zipCode = zipCode;
        this.metaData = metaData;
        this.eventTracker = new EventTracker();
        httpRef.setEventTracker(this.eventTracker);
        this.httpTracker = httpRef;
    }

    async clearBrowser () {
        try {
            const client = await this.page.target().createCDPSession();		
		    await client.send('Network.clearBrowserCookies');
        } catch ( e ) {
            throw e;
        }
	}

    checkConnection () {
        return new Promise(( resolve, reject ) => {
            InternetAvailable({
                timeout: 4000,
                retries: 3,
            }).then(() => {
                // Logger.log("Internet available");
                resolve();
            }).catch(() => {
                // Logger.log("No internet");
                reject();
            });
        });
    }

    revertWhenLoaderHidden () {
        return new Promise(( resolve, reject ) => {
            Logger.log("revertWhenLoaderHidden waiting for loader to be shown");
            this.page.waitForSelector(HTMLSelectors.page_loader).then(( resp ) => {
                Logger.log("revertWhenLoaderHidden loader is shown");
                this.page.waitForFunction(HTMLSelectors.page_loader_hidden_validator, {
                    timeout: 0
                }).then(( resp ) => {
                    Logger.log("revertWhenLoaderHidden loader is hidden");
                    resolve();
                }).catch(( err ) => {
                    Logger.log("revertWhenLoaderHidden loader hide error");
                    reject(err);
                });
            }).catch(( err ) => {
                Logger.log("revertWhenLoaderHidden loader show error");
                reject(err);
            });
        });
    }

    async clickOnPageToAvoidFocus () {
        const cTab = await this.page.$(HTMLSelectors.couponTabSelector);
        const cRow = await this.page.$(HTMLSelectors.noticeRowSelector);
        const dRow = await this.page.$(HTMLSelectors.discontinuedDrugSelector);
        const pRow = await this.page.$(HTMLSelectors.prescriptionSettingsBtnSelector);

        Logger.log("clickOnPageToAvoidFocus called");

        if (cTab ) {
            Logger.log("clicking cTab");
            await this.page.click(HTMLSelectors.couponTabSelector);
            return true;
        } else if ( cRow ) {
            Logger.log("clicking cRow");
            await this.page.click(HTMLSelectors.noticeRowSelector);
            return true;
        } else if ( dRow ) {
            Logger.log("clicking dRow");
            await this.page.click(HTMLSelectors.discontinuedDrugSelector);
            return true;
        } else if ( pRow ) {
            Logger.log("clicking pRow");
            await this.page.click(HTMLSelectors.prescriptionSettingsBtnSelector);
            return true;
        }
        return false;
    }

    resolveUnusualPageBehaviour () {
        return new Promise(async ( resolve, reject ) => {
            try {
                const url = await this.page.url();
                Logger.log("resolveUnusualPageBehaviour url", url);
                if ( url.indexOf("/discount-card") >= 0 || url.indexOf("/how-goodrx-works") >= 0 || await this.checkIfBotMessageShown() ) {
                    await this.page.goBack({
                        timeout: 0,
                        waitUntil: "load"
                    });
                    Logger.log("Page went back");
                }

                if ( url.indexOf("/pharmacy-preference") >= 0 ) {
                    Logger.log("Preference page is shown, clicking close button. Page will be redirected. Please wait...", new Date());
                    await Promise.all([
                        this.page.click("[class*='InterstitialHeader'] a"),
                        this.page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle0' }),
                    ]);
                    Logger.log("After preference page redirection", new Date());
                }

                let isSearchDropdownShown = await this.page.$(HTMLSelectors.searchDropdown);
                if ( isSearchDropdownShown ) {
                    Logger.log("search dropdown shown");
                    const isClicked = await this.clickOnPageToAvoidFocus();
                    isSearchDropdownShown = await this.page.$(HTMLSelectors.searchDropdown);
                    if ( isSearchDropdownShown ) {
                        Logger.log("search dropdown is still shown reloading page");
                        await this.page.goto(url, {
                            waitUntil: 'load',
                            timeout: 0
                        });
                    }
                }

                const isContactPersonModal = await this.page.$(HTMLSelectors.contactPersonModalSelector);
                if ( isContactPersonModal ) {
                    Logger.log("Contact person modal shown");
                    await this.page.click(HTMLSelectors.contactPersonModalCloseButtonSelector);
                }

                const pageLdrEle = await this.page.$(HTMLSelectors.page_loader);
                if ( pageLdrEle ) {
                    Logger.log("resolveUnusualPageBehaviour pageLdrEle is there");
                    await this.revertWhenLoaderHidden();
                }

                resolve();
            } catch ( e ) {
                reject(e);
            }
        });
    }

    async getFiltersFromURL () {

    }

    async getFiltersSelectedInPage () {
        let qVal;
        let dVal;
        let fVal;
        let bVal;
        let brandInputCompVal;
        let brandPageCompVal;

        let bValEle = await this.page.$("#uat-dropdown-container-brand div span");
        let qValEle = await this.page.$("#uat-dropdown-container-quantity div span");
        let dValEle = await this.page.$("#uat-dropdown-container-dosage div span");
        let fValEle = await this.page.$("#uat-dropdown-container-form div span");

        Logger.log("getFiltersSelectedInPage this.metaData", this.metaData);
        Logger.log("getFiltersSelectedInPage bValEle", bValEle);

        if ( bValEle ) {
            bVal = await this.page.evaluate(() => Array.from(document.querySelectorAll('#uat-dropdown-container-brand div span'), e => e.innerText));
            bVal = bVal.join("");
            brandInputCompVal = this.metaData.genericOrBrand;
        } else {
            bVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-brand div").innerText');
            bVal = bVal.trim();
            brandInputCompVal = this.metaData.stringVal;
        }
        Logger.log("getFiltersSelectedInPage bVal", bVal);
        brandPageCompVal = bVal;

        if ( qValEle ) {
            qVal = await this.page.evaluate(() => Array.from(document.querySelectorAll('#uat-dropdown-container-quantity div span'), e => e.innerText));
            qVal = qVal.join("");
        } else {
            qVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-quantity div").innerText');
        }

        if ( dValEle ) {
            dVal = await this.page.evaluate(() => Array.from(document.querySelectorAll('#uat-dropdown-container-dosage div span'), e => e.innerText));
            dVal = dVal.join("");
        } else {
            dVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-dosage div").innerText');
        }

        if ( fValEle ) {
            fVal = await this.page.evaluate(() => Array.from(document.querySelectorAll('#uat-dropdown-container-form div span'), e => e.innerText));
            fVal = fVal.join("");
        } else {
            fVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-form div").innerText');
        }

        Logger.log("getFiltersSelectedInPage qVal dVal fVal bVal", qVal, dVal, fVal, bVal);

        return {
            qVal,
            fVal,
            dVal,
            bVal,
            brandInputCompVal,
            brandPageCompVal
        };
    }

    async validateFilters () {
        let actualFilters = {};
        try {
            const { qVal, dVal, fVal, bVal, brandInputCompVal, brandPageCompVal } = await this.getFiltersSelectedInPage();
            Logger.log("validateFilters brandInputCompVal", brandInputCompVal);
            Logger.log("validateFilters brandPageCompVal", brandPageCompVal);
            Logger.log("validateFilters this.url", this.url);

            actualFilters = {
                "quantity": qVal,
                "form": fVal,
                "dosage": dVal,
                "label": bVal
            };

            let status = false;
            let message = "";
            let brandMatched = true;
            let formMatched = true;
            let strengthMatched = true;

            if ( this.url.indexOf("label_override") >= 0 && Utility.removeSpecialChars(Utility.getCompString(brandPageCompVal)) !== Utility.removeSpecialChars(Utility.getCompString(brandInputCompVal)) ) {
                message += `No data available for brand "` + this.metaData.genericOrBrand + `" but data is available for brand "` + bVal + `"\n`;
                brandMatched=false;
            }
            if ( brandMatched && this.url.indexOf("form") >= 0 && Utility.getCompString(fVal) !== Utility.getCompString(this.metaData.form) ) {
                message += `No data available for drug_type "` + this.metaData.form + `" but data is available for drug_type "` + fVal + `"\n`;
                formMatched=false;
            }
            if ( brandMatched && formMatched && this.url.indexOf("dosage") >= 0 && Utility.getCompString(dVal) !== Utility.getCompString(this.metaData.dosage) ) {
                message += `No data available for strength "` + this.metaData.dosage + `" but data is available for strength "` + dVal + `"\n`;
                strengthMatched=false;
            }
            if ( brandMatched && formMatched && strengthMatched && this.url.indexOf("quantity") >= 0 && Utility.getCompString(qVal) !== Utility.getCompString(this.metaData.quantity) ) {
                message += `No data available for quantity "` + this.metaData.quantity + `" but data is available for quantity "` + qVal + `"`;
            }

            if ( message.length > 0 ) {
                const lastIdx = message.lastIndexOf("\n");
                if ( lastIdx >= 0 ) {
                    message = message.substring(0, lastIdx).trim();
                }
            }

            if ( message.length === 0 ) {
                status = true;
            }

            return {
                status,
                message,
                actualFilters
            };
        } catch ( e ) {
            Logger.log("validateFilters e", e);
            return {
                status: false,
                message: "Filter validation failed",
                actualFilters
            };
        }
    }

    setZipAndGetData () {
        return new Promise(async ( resolve, reject ) => {
            this.zipCodeSetInvokeCount += 1;
            Logger.log("setZipAndGetData zipCodeSetInvokeCount", this.zipCodeSetInvokeCount);

            // Checking if modal is already open
            let locModalEle = await this.page.$(HTMLSelectors.zip_set_input_field);

            // Trigger click only if modal is not open
            if ( locModalEle === null) {
                try {
                    let firstLocEle = await this.page.$(HTMLSelectors.no_loc_set_btn);
                    let secLocEle = await this.page.$(HTMLSelectors.after_loc_set_btn);
                    if ( firstLocEle ) {
                        await this.page.click(HTMLSelectors.no_loc_set_btn);
                    } else if ( secLocEle ) {
                        await this.page.click(HTMLSelectors.after_loc_set_btn);
                    } else {
                        throw new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_BUTTON_NOT_FOUND, ErrorHandler.CODE.ZIP_SET_BUTTON_NOT_FOUND);
                    }
                } catch ( e ) {
                    if ( this.zipCodeSetInvokeCount <= 4 ) {
                        await this.resolveUnusualPageBehaviour();
                        setTimeout(() => {
                            this.setZipAndGetData().then(( resp ) => {
                                resolve(resp);
                                return;
                            }).catch(( err ) => {
                                reject(err);
                                return;
                            });
                        }, 1000);
                        return;
                    } else {
                        reject(e);
                        return;
                    }
                }
            }

            // Waiting for 15 secs in worst case for the zip code setting modal to appear
            this.page.waitForSelector(HTMLSelectors.zip_set_input_field, {
                timeout: 5000
            }).then(async ( resp ) => {
                try {
                    // Put zip code into the input field
                    await this.page.focus(HTMLSelectors.zip_set_input_field);
                    await this.page.keyboard.down('Control');
                    await this.page.keyboard.press('A');
                    await this.page.keyboard.up('Control');
                    await this.page.keyboard.press('Backspace');
                    Logger.log("To put zip code", this.zipCode);
                    await this.page.keyboard.type(this.zipCode);
                } catch ( e ) {
                    reject(new ScrapingError(ErrorHandler.MESSAGE.INVALID_ZIP_CODE_FORMAT, ErrorHandler.CODE.ZIP_SET_FAILED));
                    return;
                }

                setTimeout( async () => {

                    let zipSuccess = false;
                    let zipError = false;
                    let priceSuccess = false;
                    let priceError = false;
                    let priceData;

                    try {
                        // Submit the form
                        await this.page.click(HTMLSelectors.zip_code_submit_button);
                    } catch ( e ) {
                        reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_SUBMIT_BUTTON_NOT_FOUND, ErrorHandler.CODE.ZIP_SET_FAILED));
                        return;
                    }

                    // Attach listner for page loader to appear and disappear
                    Logger.log("Set zipcode waiting for loader to be shown");
                    this.page.waitForSelector(HTMLSelectors.page_loader).then(( resp ) => {
                        Logger.log("Set zipcode loader is shown");
                        this.page.waitForFunction('document.getElementById("modal-") === null', {
                            timeout: 0
                        }).then(( resp ) => {
                            Logger.log("Set zipcode loader is shown now");
                            checkData.call(this);
                        }).catch(( err ) => {
                            Logger.log("Set zipcode loader hide error");
                            checkData.call(this);
                        });
                    }).catch(( err ) => {
                        Logger.log("Set zipcode loader err", zipSuccess, zipError, priceSuccess, priceError);
                        checkData.call(this);
                    });

                    async function checkData () {
                        clearEvents.call(this);
                        if ( priceSuccess ) {
                            const flData = await this.validateFilters();
                            Logger.log("flData", flData);
                            resolve({
                                "data": priceData,
                                flData
                            });
                        } else {
                            if ( this.zipCodeSetInvokeCount <= 4 ) {
                                await this.resolveUnusualPageBehaviour();
                                setTimeout(() => {
                                    this.setZipAndGetData().then(( resp ) => {
                                        resolve(resp);
                                    }).catch(( err ) => {
                                        reject(err);
                                    });
                                }, 1000);
                            } else {
                                reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                            }
                        }
                    }

                    const eId22 = this.eventTracker.subscribeToEvent(Constants.ZIP_CODE_SET_SUCCESS, () => {
                        Logger.log("scraper zipcode set success");
                        zipSuccess = true;
                    });

                    const eId23 = this.eventTracker.subscribeToEvent(Constants.ZIP_CODE_SET_ERROR, () => {
                        Logger.log("scraper zipcode set error");
                        zipError = true;
                    });

                    const eId24 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_FOR_ZIP_COMPLETED, ( resp ) => {
                        Logger.log("scraper price success resp", resp);
                        priceSuccess = true;
                        priceData = resp.data;
                    });

                    const eId25 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_FOR_ZIP_FAILED, () => {
                        Logger.log("scraper price error");
                        priceError = true;
                    });

                    function clearEvents () {
                        if ( eId22 ) {
                            this.eventTracker.removeEventSubscription(Constants.ZIP_CODE_SET_SUCCESS, eId22);
                        }
                        if ( eId23 ) {
                            this.eventTracker.removeEventSubscription(Constants.ZIP_CODE_SET_ERROR, eId23);
                        }
                        if ( eId24 ) {
                            this.eventTracker.removeEventSubscription(Constants.SCRAPE_FOR_ZIP_COMPLETED, eId24);
                        }
                        if ( eId25 ) {
                            this.eventTracker.removeEventSubscription(Constants.SCRAPE_FOR_ZIP_FAILED, eId25);
                        }
                    }
                }, 0);
            }).catch(async ( err ) => {
                Logger.log("setZipAndGetData waitForSelector err =====");
                if ( this.zipCodeSetInvokeCount <= 4 ) {
                    Logger.log("zip set click did not work, reloading page");
                    await this.page.reload({
                        timeout: 0,
                        waitUntil: "load"
                    });
                    Logger.log("zip set click page reloaded");
                    await this.resolveUnusualPageBehaviour();
                    setTimeout(() => {
                        this.setZipAndGetData().then(( resp ) => {
                            resolve(resp);
                        }).catch(( err ) => {
                            reject(err);
                        });
                    }, 1000);
                } else {
                    reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_INPUT_NOT_FOUND, ErrorHandler.CODE.ZIP_SET_FAILED));
                }
            });
        });
    }

    async retrieveData () {
        try {
            this.zipCodeSetInvokeCount = 0;
            const dataVal = await this.setZipAndGetData();
            Logger.log("retrieveData type", this.metaData["type"]);
            if ( this.metaData["type"] !== Constants.ALL_COMBINATIONS && !dataVal["flData"]["status"] ) {
                throw new ScrapingError(dataVal["flData"]["message"], ErrorHandler.CODE.BAD_DATA);
            }
            return {
                dataSet: dataVal.data,
                actualFilters: dataVal.flData.actualFilters
            };
        } catch ( e ) {
            Logger.error("retrieveData e", e);
            if ( e.status ) {
                throw e;
            } else {
                throw new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED);
            }
        }
    }

    async checkIfLocationSet () {
        try {
            let firstLocEle = await this.page.$(HTMLSelectors.no_loc_set_btn);
            let secLocEle = await this.page.$(HTMLSelectors.after_loc_set_btn);

            if ( firstLocEle ) {
                return false;
            } else if ( secLocEle ) {
                return true;
            }

            return false;
        } catch ( e ) {
            throw e;
        }
    }

    async validateDrugStatus () {
        let filterSettingsRow = await this.page.$(HTMLSelectors.filterSettingsRowContainerSelector);
        let firstLocEle = await this.page.$(HTMLSelectors.no_loc_set_btn);
        let secLocEle = await this.page.$(HTMLSelectors.after_loc_set_btn);
        
        Logger.log("validateDrugStatus filterSettingsRow", filterSettingsRow ? true : false);
        Logger.log("validateDrugStatus firstLocEle", firstLocEle ? true : false);
        Logger.log("validateDrugStatus secLocEle", secLocEle ? true : false);

        if ( filterSettingsRow && ( firstLocEle || secLocEle ) ) {
            return true;
        } else if ( filterSettingsRow ) {
            return false;
        } else {
            throw new ScrapingError(ErrorHandler.MESSAGE.INVALID_INPUT, ErrorHandler.CODE.DATA_NOT_FOUND);;
        }
    }

    verifyBot () {
        return new Promise(( resolve, reject ) => {
            const ev1 = this.eventTracker.subscribeToEvent(Constants.BOT_MESSAGE_VERIFIED, ( resp ) => {
                Logger.log("Here in verify");
                this.eventTracker.removeEventSubscription(Constants.BOT_MESSAGE_VERIFIED, ev1);
                resolve();
                // try {
                //     setTimeout(async () => {
                //         resolve();
                //         // let ele = await this.page.evaluateHandle(() =>
                //         //     document.querySelector('[aria-label="Press & Hold"] div ~ div p')
                //         // );
                //         // ele.click();
                //         // await this.page.click('[aria-label="Press & Hold"] div ~ div p', {delay: 20000});
                //     }, 5000);
                // } catch ( e ) {
                //     Logger.log("verifyBot e", e);
                // }
            });
            // const element = await this.page.$x("//p[text()='Press & Hold']");
            // Logger.log("element[0]", element[0]);
        });
    }

    scrapeFromResponse ( data ) {
        return Utility.getDataFromServerResponse(data);
    }

    async checkIfBotMessageShown () {
        const roboEle = await this.page.$("body section div ~ div h1");
        if ( roboEle ) {
            const innerHtml = await this.page.$eval('body section div ~ div h1', element => element.innerHTML);
            if ( innerHtml === HTMLSelectors.botMessageTextVal ) {
                Logger.log("BOT message up");
                await this.verifyBot();
                return true;
                // Handle better
            } else {
                return false;
            }
        }
        return false;
    }

    async checkIfPageValid () {
        try {
            const err404Ele = await this.page.$("#error-404");
            const notFoundele = await this.page.$("#uat-404-content-header-container");
            const blockedOutsideUsEle = await this.page.$("body section.error-message");
            const isBotMessageShown = await this.checkIfBotMessageShown();
            if ( isBotMessageShown ) {
                throw new ScrapingError(ErrorHandler.MESSAGE.BLOCKED_IP, ErrorHandler.CODE.CONNECTION_FORBIDDEN);
            } else if ( blockedOutsideUsEle ) {
                Logger.log("checkIfPageValid Blocked outside US");
                throw new ScrapingError(ErrorHandler.MESSAGE.BLOCKED_OUTSIDE_US, ErrorHandler.CODE.CONNECTION_FORBIDDEN);
            } else if ( err404Ele || notFoundele ) {
                Logger.log("checkIfPageValid URL not found");
                throw new ScrapingError(ErrorHandler.MESSAGE.INVALID_INPUT, ErrorHandler.CODE.DATA_NOT_FOUND);
            } else {
                return true;
            }
        } catch ( e ) {
            throw e;
        }
    }

    async loadPage () {
        try {
            await this.clearBrowser();
            await this.page.goto(this.url, {
                waitUntil: 'load',
                timeout: 0
            });
            // Set proper timeout
            const isValidPage = await this.checkIfPageValid();
            Logger.log("Scraper isValidPage", isValidPage);

            const dataState = await this.validateDrugStatus();
            Logger.log("Scraper dataState", dataState);
            return dataState;
        } catch ( e ) {
            throw e;
        }
    }
}

module.exports = Scraper;
