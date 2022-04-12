const Constants = require("./../constants");
const ErrorHandler = require("../error-handler");
const { ScrapingError } = require("../ErrorTypes");
const Scraper = require("./Scraper");
const HTMLSelectors = require("./../html-selectors");
const Utility = require("../Utility");

class WildcardScraper extends Scraper {

    #globalEventTracker;
    #wildcardStatus;
    #eventSubs;
    #dropInvokeCount;
    #optInvokeCount;

    constructor ( page, url, zipCode, metaData, httpRef, globalEventTracker, status ) {
        super(page, url, zipCode, metaData, httpRef);
        this.#globalEventTracker = globalEventTracker;
        this.#wildcardStatus = status;
        this.eventTracker.defineEvents([Constants.SCRAPE_LABELS_COMPLETED, Constants.SCRAPE_QUANTITIES,
            Constants.SCRAPE_FOR_ZIP_COMPLETED, Constants.SCRAPE_FOR_ZIP_FAILED, Constants.SCRAPE_QUANTITIE_COMPLETED,
            Constants.SCRAPE_DOSAGES, Constants.SCRAPE_DOSAGES_COMPLETED, Constants.SCRAPE_FORMS,
            Constants.SCRAPE_FORMS_COMPLETED, Constants.SCRAPE_LABELS, Constants.PRICE_REQUEST_TRIGGERED,
            Constants.ZIP_CODE_SET_SUCCESS, Constants.ZIP_CODE_SET_ERROR, Constants.BOT_MESSAGE_VERIFIED,
            Constants.ALL_REQUESTS_DONE, Constants.RESET_DOSAGES, Constants.RESET_FORMS
        ]);
        this.#eventSubs = {};
        this.#dropInvokeCount = 0;
        this.#optInvokeCount = 0;
    }

    #removeEventSubscriptions () {
        if ( this.#eventSubs.evt1 ) {
            this.eventTracker.removeEventSubscription(Constants.SCRAPE_QUANTITIES, this.#eventSubs.evt1);
        }
        if ( this.#eventSubs.evt2 ) {
            this.eventTracker.removeEventSubscription(Constants.SCRAPE_QUANTITIE_COMPLETED, this.#eventSubs.evt2);
        }
        if ( this.#eventSubs.evt3 ) {
            this.eventTracker.removeEventSubscription(Constants.RESET_DOSAGES, this.#eventSubs.evt3);
        }
        if ( this.#eventSubs.evt4 ) {
            this.eventTracker.removeEventSubscription(Constants.SCRAPE_DOSAGES_COMPLETED, this.#eventSubs.evt4);
        }
        if ( this.#eventSubs.evt5 ) {
            this.eventTracker.removeEventSubscription(Constants.RESET_FORMS, this.#eventSubs.evt5);
        }
        if ( this.#eventSubs.evt6 ) {
            this.eventTracker.removeEventSubscription(Constants.SCRAPE_FORMS_COMPLETED, this.#eventSubs.evt6);
        }
        if ( this.#eventSubs.evt7 ) {
            this.eventTracker.removeEventSubscription(Constants.SCRAPE_LABELS_COMPLETED, this.#eventSubs.evt7);
        }
    }

    #openDropdown ( qaVal, eleSel ) {
        return new Promise(async ( resolve, reject ) => {
            try {
                this.#dropInvokeCount += 1;
                Logger.log("openDropdown dropInvokeCount and eleSel", this.#dropInvokeCount, eleSel);
                const els = await this.page.$$(eleSel);
                if ( els && els.length > 0 ) {
                    Logger.log("openDropdown else ===========", els);
                }
                await this.page.click(eleSel);

                this.page.waitForSelector(HTMLSelectors.filter_dropdown_common_selector, {
                    timeout: 5000
                }).then(async ( resp ) => {
                    const dropEle = await this.page.$('button[data-qa="' + qaVal + '"]');
                    if ( dropEle ) {
                        Logger.log("openDropdown dropEle showed up");
                        resolve();
                    } else {
                        Logger.log("openDropdown no dropEle");
                        if ( this.#dropInvokeCount <= 2 ) {
                            await this.resolveUnusualPageBehaviour();
                            setTimeout(() => {
                                this.#openDropdown(qaVal, eleSel).then(( opts ) => {
                                    resolve(opts);
                                }).catch(( err ) => {
                                    reject(err);
                                });
                            }, 1000);
                        } else {
                            reject (new ScrapingError(ErrorHandler.MESSAGE.FILTER_DROPDOWN_DIDNOT_OPEN, ErrorHandler.CODE.UNRESPONSIVE_CLICK));
                            // To be rejected
                        }
                    }
                }).catch(async ( err ) => {
                    Logger.log("openDropdown err =====", err);
                    if ( this.#dropInvokeCount <= 2 ) {
                        Logger.log("Open dropdown did not work, reloading page");
                        await this.page.reload({
                            timeout: 0,
                            waitUntil: "load"
                        });
                        Logger.log("Open dropdown page reloaded");
                        await this.resolveUnusualPageBehaviour();
                        setTimeout(() => {
                            this.#openDropdown(qaVal, eleSel).then(( opts ) => {
                                resolve(opts);
                            }).catch(( err ) => {
                                reject(err);
                            });
                        }, 1000);
                    } else {
                        reject (new ScrapingError(ErrorHandler.MESSAGE.FILTER_DROPDOWN_DIDNOT_OPEN, ErrorHandler.CODE.UNRESPONSIVE_CLICK));
                        // To be rejected
                    }
                });
            } catch ( e ) {
                Logger.log("openDropdown e 11", e);
                if ( this.#dropInvokeCount <= 2 ) {
                    await this.resolveUnusualPageBehaviour();
                    setTimeout(() => {
                        this.#openDropdown(qaVal, eleSel).then(( opts ) => {
                            resolve(opts);
                        }).catch(( err ) => {
                            reject(err);
                        });
                    }, 1000);
                } else {
                    reject (new ScrapingError(ErrorHandler.MESSAGE.FILTER_DROPDOWN_DIDNOT_OPEN, ErrorHandler.CODE.UNRESPONSIVE_CLICK));
                    // To be rejected
                }
            }
        });
    }

    async #prepareOptionsList ( els ) {
        try {
            const options = [];
            for ( let i = 0; i < els.length; i++ ) {
                const qaVal = await els[i].$eval('button', i => i.getAttribute('data-qa'));
                let iTag = await els[i].$eval('button', i => i.getAttribute('aria-selected'));
                
                options.push({
                    "qa": qaVal,
                    "scraped": iTag == "true" ? true : false
                });
            }
            return options;
        } catch ( e ) {
            throw e;
        }
    }

    #getOptions ( selector, eleSel ) {
        return new Promise(async ( resolve, reject ) => {
            try {
                this.#optInvokeCount += 1;
                Logger.log("getOptions optInvokeCount", this.#optInvokeCount);
                await this.page.click(eleSel);

                this.page.waitForSelector(HTMLSelectors.filter_dropdown_common_selector, {
                    timeout: 5000
                }).then(async ( resp ) => {
                    Logger.log("getOptions resp =====");
                    const els = await this.page.$$(selector);
                    if ( els && els.length > 0 ) {
                        let options;
                        try {
                            options = await this.#prepareOptionsList(els);
                        } catch ( e ) {
                            reject (new ScrapingError(ErrorHandler.MESSAGE.FILTER_OPTIONS_NOT_AVAILABLE, ErrorHandler.CODE.UNRESPONSIVE_CLICK));
                            return;
                        }
                        await this.clickOnPageToAvoidFocus();
                        resolve(options);
                    } else {
                        if ( this.#optInvokeCount <= 2 ) {
                            await this.resolveUnusualPageBehaviour();
                            setTimeout(() => {
                                this.#getOptions(selector, eleSel).then(( opts ) => {
                                    resolve(opts);
                                }).catch(( err ) => {
                                    reject(err);
                                });
                            }, 1000);
                        } else {
                            reject (new ScrapingError(ErrorHandler.MESSAGE.FILTER_DROPDOWN_DIDNOT_OPEN, ErrorHandler.CODE.UNRESPONSIVE_CLICK));
                            return;
                        }
                    }
                }).catch(async ( err ) => {
                    Logger.log("getOptions err =====", err);
                    if ( this.#optInvokeCount <= 2 ) {
                        Logger.log("get options did not work, reloading page");
                        await this.page.reload({
                            timeout: 0,
                            waitUntil: "load"
                        });
                        Logger.log("get options page reloaded");
                        await this.resolveUnusualPageBehaviour();
                        setTimeout(() => {
                            this.#getOptions(selector, eleSel).then(( opts ) => {
                                resolve(opts);
                            }).catch(( err ) => {
                                reject(err);
                            });
                        }, 1000);
                    } else {
                        reject (new ScrapingError(ErrorHandler.MESSAGE.FILTER_DROPDOWN_DIDNOT_OPEN, ErrorHandler.CODE.UNRESPONSIVE_CLICK));
                        return;
                    }
                });
            } catch ( e ) {
                Logger.log("getOptions e 11", e);
                if ( this.#optInvokeCount <= 2 ) {
                    await this.resolveUnusualPageBehaviour();
                    setTimeout(() => {
                        this.#getOptions(selector, eleSel).then(( opts ) => {
                            resolve(opts);
                        }).catch(( err ) => {
                            reject(err);
                        });
                    }, 1000);
                } else {
                    reject (new ScrapingError(ErrorHandler.MESSAGE.FILTER_DROPDOWN_DIDNOT_OPEN, ErrorHandler.CODE.UNRESPONSIVE_CLICK));
                    return;
                }
            }
        });
    }

    #takeActionOnFilterLink ( filterType, qaVal ) {
        return new Promise(async ( resolve, reject ) => {
            try {
                if ( filterType === "label" ) {
                    console.log("Label filter clicked, page may get redirected. Please wait...");
                    Logger.log("Label filter clicked, page may get redirected. Please wait...");
                    await Promise.all([
                        this.page.click('button[data-qa="' + qaVal + '"]'),
                        this.page.waitForNavigation({ timeout: 0, waitUntil: 'networkidle0' }),
                    ]);
                    Logger.log("takeActionOnFilterLink page loaded");
                } else {
                    Logger.log("takeActionOnFilterLink others clicked");
                    await this.page.click('button[data-qa="' + qaVal + '"]');
                    await this.revertWhenLoaderHidden();
                    Logger.log("takeActionOnFilterLink loader hidde for others");
                }
                resolve();
            } catch ( e ) {
                reject(new ScrapingError(ErrorHandler.MESSAGE.FILTER_OPTIONS_CLICK_DIDNOT_WORK, ErrorHandler.CODE.UNRESPONSIVE_CLICK));
            }
        });
    }

    #getNextFilterOption ( options ) {
        if ( options && options.length > 0 ) {
            for ( let i = 0; i < options.length; i++ ) {
                if ( options[i]["scraped"] === false ) {
                    return options[i];
                }
            }
        }
        return null;
    }

    async #validatePage () {
        try {
            const isValidPage = await this.checkIfPageValid();
            Logger.log("validatePage isValidPage", isValidPage);
            const drugStatus = await this.validateDrugStatus();
            return drugStatus;
        } catch ( err ) {
            Logger.error("validatePage err", err);
            if ( err.status === ErrorHandler.CODE.DATA_NOT_FOUND ) {
                try {
                    const drugStatus = await this.validateDrugStatus();
                    return drugStatus;
                } catch ( err2 ) {
                    throw err2;
                }
            } else {
                throw err;
            }
        }
    }

    #scrapeNextFilter ( options, filterType, selEle ) {
        return new Promise(async ( resolve, reject ) => {
            let nextQ;
            try {
                nextQ = this.#getNextFilterOption(options);
            } catch ( e ) {
                Logger.log("scrapeNextFilter e 11", e);
                reject(e);
                return;
            }
            
            if ( nextQ ) {
                let qaVal;
                try {
                    qaVal = nextQ["qa"];
                    Logger.log('scrapeNextFilter qaVal', qaVal);
                    
                    this.#dropInvokeCount = 0;
                    await this.#openDropdown(qaVal, selEle);
                    await this.clearBrowser();
                } catch ( e ) {
                    Logger.log("scrapeNextFilter first catch =====", e);
                    reject(e);
                    return;
                }
                setTimeout(async () => {
                    Logger.log("scrapeNextFilter after timeout dropdown is open");
                    try {
                        await this.#takeActionOnFilterLink(filterType, qaVal);
                    } catch ( e ) {
                        Logger.log("scrapeNextFilter second catch e", e);
                        reject(e);
                        return;
                    }

                    Logger.log("scrapeNextFilter after filter optionn action");
                    nextQ["scraped"] = true;
                    let isPageValid;
                    try {
                        isPageValid = await this.#validatePage();
                    } catch ( e ) {
                        reject(e);
                        return;
                    }
                    
                    Logger.log("scrapeNextFilter isPageValid", isPageValid);
                    if ( isPageValid ) {
                        let dataVal;
                        setTimeout(async () => {
                            Logger.log("scrapeNextFilter after 5s to retrieve data");
                            try {
                                dataVal = await this.retrieveData();
                            } catch ( e ) {
                                Logger.error("scrapeNextFilter Error wildcard e", e);
                                // reject(e);
                                // return;
                            } finally {
                                Logger.log("scrapeNextFilter dataVal", dataVal);
                                if ( dataVal ) {
                                    this.#globalEventTracker.notifyEvent(Constants.WILD_CARD_OUTPUT, dataVal);
                                }
        
                                let isNextQ = this.#getNextFilterOption(options);
                                if ( isNextQ ) {
                                    Logger.log("scrapeNextFilter isNextQ available");
                                    resolve(options);
                                } else {
                                    Logger.log("scrapeNextFilter all done");
                                    resolve(true);
                                }
                            }
                        }, 1000);
                    } else {
                        const flData = await this.validateFilters();
                        Logger.log("scrapeNextFilter flData", flData);
                        this.#globalEventTracker.notifyEvent(Constants.WILD_CARD_OUTPUT, {
                            "dataSet": {
                                "idpMin": "",
                                "idpMax": ""
                            },
                            "actualFilters": flData["actualFilters"]
                        });

                        let isNextQ = this.#getNextFilterOption(options);
                        if ( isNextQ ) {
                            Logger.log("scrapeNextFilter isNextQ available");
                            resolve(options);
                        } else {
                            Logger.log("scrapeNextFilter all done");
                            resolve(true);
                        }
                    }
                }, 1000);
            } else {
                resolve(true);
            }
        });
    }

    #scrapeQuantity () {
        return new Promise(( resolve, reject ) => {
            let options = [];

            const evt1 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_QUANTITIES, async ( data ) => {

                let isWildcardSupported;
                try {
                    isWildcardSupported = await this.#checkIfWildcardSupported(HTMLSelectors.quantity_enabled_selector, this.#wildcardStatus["isQuantityWildcard"]);
                    Logger.log("SCRAPE_QUANTITIES called isWildcardSupported", isWildcardSupported);
                } catch ( e ) {
                    reject(e);
                    return;
                }

                if ( !isWildcardSupported ) {
                    this.eventTracker.notifyEvent(Constants.SCRAPE_QUANTITIE_COMPLETED);
                } else {
                    if ( data && data["isFresh"] ) {
                        Logger.log("SCRAPE_QUANTITIES fresh usecase");
                        options = [];
                        this.#optInvokeCount = 0;
                        try {
                            options = await this.#getOptions(HTMLSelectors.quantity_options_selector, HTMLSelectors.quantitySettingParEle);
                        } catch ( e ) {
                            reject(e);
                            return;
                        }
                        Logger.log("SCRAPE_QUANTITIES options", options);
                    }

                    this.#scrapeNextFilter(options, "quantity", HTMLSelectors.quantitySettingParEle).then(( resp ) => {
                        Logger.log("SCRAPE_QUANTITIES scrapeNextFilter resp", resp);
                        if ( resp === true ) {
                            this.eventTracker.notifyEvent(Constants.SCRAPE_QUANTITIE_COMPLETED);
                        } else {
                            options = resp;
                            this.eventTracker.notifyEvent(Constants.SCRAPE_QUANTITIES, {
                                "isFresh": false
                            });
                        }
                    }).catch(( err ) => {
                        Logger.log("SCRAPE_QUANTITIES err 2", err);
                        reject(err);
                        return;
                    });
                }
            });

            this.#eventSubs.evt1 = evt1;
        });
    }

    #scrapeDosage () {
        return new Promise(( resolve, reject ) => {
            let options = [];
            let allDone = false;

            async function scrapeData () {

                let isWildcardSupported;
                try {
                    isWildcardSupported = await this.#checkIfWildcardSupported(HTMLSelectors.dosage_enabled_selector, this.#wildcardStatus["isDosageWildcard"]);
                    Logger.log("SCRAPE_DOSAGES isWildcardSupported", isWildcardSupported);
                } catch ( e ) {
                    reject(e);
                    return;
                }

                Logger.log("SCRAPE_DOSAGES allDone", allDone);

                if ( !isWildcardSupported || allDone ) {
                    Logger.log("No scraping for dosages");
                    this.eventTracker.notifyEvent(Constants.SCRAPE_DOSAGES_COMPLETED);
                } else {
                    Logger.log("SCRAPE_DOSAGES options.length", options.length);
                    if ( options.length === 0 ) {
                        this.#optInvokeCount = 0;
                        try {
                            options = await this.#getOptions(HTMLSelectors.dosage_options_selector, HTMLSelectors.dosageSettingParEle);
                        } catch ( e ) {
                            reject(e);
                            return;
                        }
                        Logger.log("scrapeDosage options", options);
                    }

                    this.#scrapeNextFilter(options, "dosage", HTMLSelectors.dosageSettingParEle).then(( resp ) => {
                        Logger.log("SCRAPE_DOSAGES scrapeNextFilter resp", resp);
                        if ( resp === true ) {
                            allDone = true;
                        } else {
                            options = resp;
                        }
                        this.eventTracker.notifyEvent(Constants.SCRAPE_QUANTITIES, {
                            "isFresh": true
                        });
                    }).catch(( err ) => {
                        Logger.log("SCRAPE_DOSAGES scrapeNextFilter err", err);
                        reject(err);
                        return;
                    });
                }
            }

            const evt1 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_QUANTITIE_COMPLETED, ( data ) => {
                scrapeData.call(this);
            });
            const evt2 = this.eventTracker.subscribeToEvent(Constants.RESET_DOSAGES, ( data ) => {
                options = [];
                allDone = false;
            });

            this.#eventSubs.evt2 = evt1;
            this.#eventSubs.evt3 = evt2;
        });
    }

    #scrapeForms () {
        return new Promise(( resolve, reject ) => {
            let options = [];
            let allDone = false;

            async function scrapeData () {
                let isWildcardSupported;
                try {
                    isWildcardSupported = await this.#checkIfWildcardSupported(HTMLSelectors.form_enabled_selector, this.#wildcardStatus["isFormWildcard"]);
                    Logger.log("SCRAPE_FORMS isWildcardSupported", isWildcardSupported);
                } catch ( e ) {
                    reject(e);
                    return;
                }
                Logger.log("SCRAPE_FORMS allDone", allDone);

                if ( !isWildcardSupported || allDone ) {
                    this.eventTracker.notifyEvent(Constants.SCRAPE_FORMS_COMPLETED);
                } else {
                    Logger.log("SCRAPE_FORMS options.length", options.length);

                    if ( options.length === 0 ) {
                        this.#optInvokeCount = 0;
                        try {
                            options = await this.#getOptions(HTMLSelectors.form_options_selector, HTMLSelectors.formSettingParEle);
                        } catch ( e ) {
                            reject(e);
                            return;
                        }
                        Logger.log("scrapeForms options", options);
                    }

                    this.#scrapeNextFilter(options, "form", HTMLSelectors.formSettingParEle).then(( resp ) => {
                        Logger.log("scrapeForms scrapeNextFilter resp", resp);
                        if ( resp === true ) {
                            allDone = true;
                        } else {
                            options = resp;
                        }
                        this.eventTracker.notifyEvent(Constants.RESET_DOSAGES);
                        this.eventTracker.notifyEvent(Constants.SCRAPE_QUANTITIES, {
                            "isFresh": true
                        });
                    }).catch(( err ) => {
                        Logger.log("scrapeForms scrapeNextFilter err", err);
                        reject(err);
                        return;
                    });
                }
            }

            const evt1 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_DOSAGES_COMPLETED, ( data ) => {
                scrapeData.call(this);
            });
            const evt2 = this.eventTracker.subscribeToEvent(Constants.RESET_FORMS, ( data ) => {
                options = [];
                allDone = false;
            });

            this.#eventSubs.evt4 = evt1;
            this.#eventSubs.evt5 = evt2;
        });
    }

    #scrapeLabels () {
        return new Promise(( resolve, reject ) => {
            let options = [];
            let allDone = false;

            async function scrapeData () {
                let isWildcardSupported;
                try {
                    isWildcardSupported = await this.#checkIfWildcardSupported(HTMLSelectors.label_enabled_selector, this.#wildcardStatus["isBrandWildcard"]);
                    Logger.log("SCRAPE_LABELS called isWildcardSupported", isWildcardSupported);
                } catch ( e ) {
                    reject(e);
                    return;
                }

                Logger.log("SCRAPE_LABELS called allDone", allDone);

                if ( !isWildcardSupported || allDone ) {
                    this.eventTracker.notifyEvent(Constants.SCRAPE_LABELS_COMPLETED);
                } else {
                    Logger.log("SCRAPE_LABELS options.length", options.length);

                    if ( options.length === 0 ) {
                        this.#optInvokeCount = 0;
                        try {
                            options = await this.#getOptions(HTMLSelectors.brand_options_selector, HTMLSelectors.brandSettingParEle);
                        } catch ( e ) {
                            reject(e);
                            return;
                        }
                        
                        Logger.log("SCRAPE_LABELS options", options);
                    }

                    this.#scrapeNextFilter(options, "label", HTMLSelectors.brandSettingParEle).then(( resp ) => {
                        Logger.log("SCRAPE_LABELS scrapeNextFilter resp 2", resp);
                        if ( resp === true ) {
                            allDone = true;
                        } else {
                            options = resp;
                        }

                        this.eventTracker.notifyEvent(Constants.RESET_FORMS);
                        this.eventTracker.notifyEvent(Constants.RESET_DOSAGES);
                        this.eventTracker.notifyEvent(Constants.SCRAPE_QUANTITIES, {
                            "isFresh": true
                        });
                    }).catch(( err ) => {
                        Logger.log("SCRAPE_LABELS scrapeNextFilter err 2", err);
                        reject(err);
                        return;
                    });
                }
            }

            const evt1 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_FORMS_COMPLETED, ( data ) => {
                scrapeData.call(this);
            });

            this.#eventSubs.evt6 = evt1;
        });
    }

    async #checkIfWildcardSupported ( selector, status ) {
        let isEleDisabled;
        try {
            let classVal = await this.page.evaluate(selector);
            isEleDisabled = classVal.indexOf(HTMLSelectors.filterDisabledClassName) >= 0;
        } catch ( e ) {
            throw e;
        }
        
        if ( isEleDisabled || !status ) {
            return false;
        }
        return true;
    }

    #mimicUser ( status ) {
        return new Promise(async ( resolve, reject ) => {
            Logger.log("Wildcard mimicUser status", status);
            const evt7 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_LABELS_COMPLETED, ( data ) => {
                Logger.log("SCRAPE_LABELS_COMPLETED");
                resolve();
            });
            this.#eventSubs.evt7 = evt7;

            try {
                if ( status ) {
                    let dataVal = await this.retrieveData();
                    Logger.log("Wildcard mimicUser dataVal", dataVal);
                    if ( dataVal ) {
                        this.#globalEventTracker.notifyEvent(Constants.WILD_CARD_OUTPUT, dataVal);
                    }
                }
            } catch ( e ) {
                reject(e);
                return;
            }

            this.#scrapeQuantity().then(( resp ) => {
                Logger.log("Wildcard scrapeQuantity resp", resp);
            }).catch(( err ) => {
                Logger.log("Wildcard scrapeQuantity err", err);
                reject(err);
            });
            
            this.#scrapeDosage().then(( resp ) => {
                Logger.log("Wildcard scrapeDosage resp", resp);
            }).catch(( err ) => {
                Logger.log("Wildcard scrapeDosage err", err);
                reject(err);
            });

            this.#scrapeForms().then(( resp ) => {
                Logger.log("Wildcard scrapeForms resp", resp);
            }).catch(( err ) => {
                Logger.log("Wildcard scrapeForms err", err);
                reject(err);
            });

            this.#scrapeLabels().then(( resp ) => {
                Logger.log("Wildcard scrapeLabels resp", resp);
            }).catch(( err ) => {
                Logger.log("Wildcard scrapeLabels err", err);
                reject(err);
            });

            this.eventTracker.notifyEvent(Constants.SCRAPE_QUANTITIES, {
                "isFresh": true
            });
        });
    }

    async scrapeData () {
        try {
            Logger.log("WildcardScraper to scrapeData");
            const dataStat = await this.loadPage();
            Logger.log("WildcardScraper scrapeData dataStat", dataStat);
            await this.#mimicUser(dataStat);
            this.#removeEventSubscriptions();
            this.#eventSubs = {};
            return {
                dataSet: [],
                actualFilters: null
            }
        } catch ( err ) {
            this.#removeEventSubscriptions();
            this.#eventSubs = {};
            Logger.log("WildcardScraper scrapeData err", err);
            const errObj = Utility.getError(err);
            let actualFilters;
            try {
                Logger.log("Wildcard scraping failed but trying to get the filters");
                const { qVal, dVal, fVal, bVal } = await this.getFiltersSelectedInPage();
                actualFilters = {
                    "quantity": qVal,
                    "form": fVal,
                    "dosage": dVal,
                    "label": bVal
                };
                errObj.actualFilters = actualFilters;
            } catch ( e ) {
                Logger.log("Error in wildcard filter extraction e", e);
            } finally {
                if ( errObj && errObj.status && errObj.status === ErrorHandler.CODE.PROXY_CONNECTION_ISSUE) {
                    throw errObj;
                } else if ( errObj && errObj.status && errObj.status === ErrorHandler.CODE.CONNECTION_ISSUE ) {
                    this.checkConnection().then(async () => {
                        try {
                            const resp = await this.scrapeData();
                            return resp;
                        } catch ( e ) {
                            throw errObj;
                        }
                    }).catch(() => {
                        throw errObj;
                    });
                } else {
                    throw errObj;
                }
            }
        }
    }
}

module.exports = WildcardScraper;
