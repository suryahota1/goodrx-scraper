const puppeteer = require('puppeteer');
const InputManager = require('./input-manager');
const OutputManager = require('./output-manager');
const ErrorHandler = require('./error-handler');
const path = require("path");
const Log = require('./logger');
const LicenseValidator = require("./license-validator");
const EventTracker = require('./EventTracker');
const Constants = require('./constants');
const UrlScraper = require('./scrape-engine/UrlScraper');
const WildcardScraper = require('./scrape-engine/WildcardScraper');
const HttpTracker = require('./HttpTracker');
const { ScrapingError } = require('./ErrorTypes');
let stayAwake;

if ( process.platform === "win32" || process.platform === "darwin" ) {
    try {
        stayAwake = require('stay-awake');
    } catch ( e ) {
        console.log("Stay awake module not found");
    }
}

function main () {
    return new Promise(( resolve, reject ) => {
        if ( stayAwake ) {
            stayAwake.prevent(function(err, data) {
                // handle error
                Logger.log('%d routines are preventing sleep', data);
            });   
        }
        let browser;
        let proxyHost;
        let proxyPort;

        let pagePool = {};
        const poolSize = 1;

        let scrapeIdx = 0;
        let properties;

        let successCount = 0;
        let failCount = 0;
        let ipFileName;

        let formattedData = [];
        const eventTracker = new EventTracker();

        function trackTabs () {
            browser.on('targetcreated', async function() {
                const [ page1, page2 ] = await browser.pages();
                try {
                    if ( page2 ) {
                        page2.close();
                    }
                } catch ( e ) {
                    console.log("trackTabs e", e);
                }
            });
        }

        async function createPagePool ( userName, password) {
            try {
                for ( let i = 2; i <= poolSize; i++ ) {
                    const newPage = await browser.newPage();
                    await newPage.setRequestInterception(true);
                    await newPage.authenticate({
                        username: userName,
                        password: password
                    });
                    const httpTkr1 = new HttpTracker(newPage);
                    httpTkr1.initializeHttpListners();

                    pagePool[i] = {
                        "page": newPage,
                        "status": "free",
                        "httpTracker": httpTkr1
                    };
                }
            } catch ( e ) {
                throw e;
            }
        }

        function getAvailablePage () {
            for ( const key in pagePool ) {
                if ( pagePool[key]["status"] === "free" ) {
                    return key;
                }
            }
        }

        async function getDefPage ( userName, password ) {
            const [ page ] = await browser.pages();
            // await page.setViewport({ width: 1366, height: 768});
            await page.setRequestInterception(true);

            // Handle authentication error

            await page.authenticate({
                username: userName,
                password: password
            });

            if ( !page.isJavaScriptEnabled() ) {
                Logger.log("Javascript is disabled on page");
                await page.setJavaScriptEnabled(true);
            }

            return page;
        }

        async function launchBrowser () {
            try {
                const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || (process.pkg
                ? path.join( path.dirname(process.execPath),
                    'puppeteer',
                    ...puppeteer
                    .executablePath()
                    .split(path.sep)
                    .slice(6),
                ) : puppeteer.executablePath());
                browser = await puppeteer.launch({
                    executablePath,
                    headless: false,
                    args: ["--proxy-server=" + proxyHost + ":" + proxyPort],
                    ignoreHTTPSErrors: true
                });

                // Removing global variables
                proxyHost = null;
                proxyPort = null;

                trackTabs();

                return true;
            } catch ( e ) {
                Logger.error("browser error", e);
                throw e;
            }
        }

        function validateLicense ( page ) {
            return new Promise(( resolve, reject ) => {
                const LcsValidator = new LicenseValidator();
                console.log("Checking permission, please wait...");
                LcsValidator.validateLicenseOnServer().then(async ({ status1, result1 }) => {
                    Logger.log("activate status1", status1);
                    Logger.log("activate result1", result1);
                    if ( status1 !== null && !status1 ) {
                        const lcsState = LcsValidator.getLincenseObjectState();
                        lcsState["validation"] = "load";
                        var contentHtml = LcsValidator.getHtmlLayout(lcsState);
                        await page.setContent(contentHtml);

                        await page.exposeFunction('activate', async ( key ) => {
                            Logger.log("activate clicked", key);
                            if ( key ) {
                                const lcsState1 = LcsValidator.getLincenseObjectState();
                                lcsState1["validation"] = "inprogress";
                                lcsState1["activationKey"] = key;
                                var contentHtml = LcsValidator.getHtmlLayout(lcsState1);
                                await page.setContent(contentHtml);

                                LcsValidator.activateLicense(key).then(async ( {status, result} ) => {
                                    Logger.log("status", status);
                                    Logger.log("result", result);
                                    const newState = {
                                        result,
                                        activationKey: key
                                    };
                                    if ( status ) {
                                        newState["validation"] = "success";
                                        var contentHtml = LcsValidator.getHtmlLayout(newState);
                                        await page.setContent(contentHtml);
                                        resolve();
                                    } else {
                                        newState["validation"] = "fail";
                                        var contentHtml = LcsValidator.getHtmlLayout(newState);
                                        await page.setContent(contentHtml);
                                    }
                                });
                            } else {
                                console.log("Please enter activation key");
                            }
                        });
                        await page.setContent(contentHtml);
                    } else if ( status1 === null) {
                        reject(new ScrapingError(ErrorHandler.MESSAGE.LICENSE_VALIDATION_FAILED, ErrorHandler.CODE.LICENSE_VALIDATION_FAILED));
                    } else {
                        resolve();
                    }
                }).catch(( err ) => {
                    Logger.log("errr ----------", err);
                    reject(err);
                });
            });
        }

        async function checkBrowserLaunch () {

        }

        async function startScraping ( ipResp ) {
            let userName;
            let password;
            try {
                // Launch browser when needed
                await launchBrowser();
                Logger.log("browser launched");

                userName = properties.get("proxy.auth.username");
                password = properties.get("proxy.auth.password");

                const page = await getDefPage(userName, password);

                await validateLicense(page);
                Logger.log("License validated");
                const httpTkr1 = new HttpTracker(page);
                httpTkr1.initializeHttpListners();
                pagePool["1"] = {
                    "page": page,
                    "status": "free",
                    "httpTracker": httpTkr1
                };
            } catch ( e ) {
                console.log(e.message);
                stopScraping();
                return;
            }
            const promList = [OutputManager.generateOutputFile(ipResp.pharmacies, ipResp["outputFileName"], properties), OutputManager.generateLogFile(ipResp["logFileName"], properties)];
            Promise.all(promList).then(async ( resp ) => {
                if ( formattedData && formattedData.length > 0 ) {
                    Logger.log("input size", formattedData.length);
                    await createPagePool(userName, password);
                    const keys = Object.keys(pagePool);
                    Logger.log("keys ====", keys);
                    eventTracker.defineEvents([Constants.PAGE_SCRAPE_DONE, Constants.WILD_CARD_OUTPUT]);

                    for ( let i = 0; i < poolSize; i++ ) {
                        const pageKey = getAvailablePage();
                        if ( pageKey && formattedData[scrapeIdx] ) {
                            Logger.log("Available page pageKey", pageKey);
                            Logger.log("Available page scrapeIdx", scrapeIdx);

                            pagePool[pageKey]["status"] = "assigned";
                            scrapeData(formattedData[scrapeIdx++], pageKey);
                        }
                    }
                    
                    eventTracker.subscribeToEvent(Constants.PAGE_SCRAPE_DONE, async () => {
                        const pageKey = getAvailablePage();
                        Logger.log("PAGE_SCRAPE_DONE pageKey", pageKey);
                        Logger.log("PAGE_SCRAPE_DONE successCount", successCount);
                        Logger.log("PAGE_SCRAPE_DONE failCount", failCount);
                        Logger.log("PAGE_SCRAPE_DONE scrapeIdx", scrapeIdx);
                        Logger.log("PAGE_SCRAPE_DONE total", formattedData.length);

                        if ( pageKey && formattedData[scrapeIdx] ) {
                            pagePool[pageKey]["status"] = "assigned";
                            scrapeData(formattedData[scrapeIdx++], pageKey);
                        } else if ( pageKey && !formattedData[scrapeIdx] ) {
                            await pagePool[pageKey]["page"].close();
                            delete pagePool[pageKey];
                        }
                        
                        if ( successCount + failCount === formattedData.length ) {
                            console.log("Sending email...");
                            stopScraping();
                            OutputManager.sendEmail(successCount, failCount, ipFileName, properties).then(() => {
                                Logger.log("Email sent successfully");
                            }).catch(( err ) => {
                                Logger.log("Email sending failed");
                            });
                            return;
                        }
                    });
                } else {
                    throw new Error(ErrorHandler.MESSAGE.NO_DATA_TO_SCRAPE);
                }
            }).catch(( e ) => {
                console.log(e.message);
                if ( e.message === ErrorHandler.MESSAGE.BROWSER_LAUNCH_FAIL || 
                    e.message === ErrorHandler.MESSAGE.NO_DATA_TO_SCRAPE ||
                    e.message === ErrorHandler.MESSAGE.PROXY_CONNECTIVITY_ISSUE ||
                    e.status === ErrorHandler.CODE.PROXY_CONNECTION_ISSUE ||
                    e.status === ErrorHandler.CODE.OUTPUT_DIRECTORY_EXISTS ||
                    e.status === ErrorHandler.CODE.INVALID_OUTPUT_DIRECTORY || 
                    e.status === ErrorHandler.CODE.MISSING_OUTPUT_FILE ) {
                    stopScraping();
                }
            });
        }

        async function writeErrorLogs ( data, err, acf = {} ) {
            try {
                Logger.log("writeErrorLogs url", data["url"]);
                Logger.log("writeErrorLogs acf", acf);
                await OutputManager.saveLog(data, {
                    "noOfResults": 0,
                    "successOrFail": "Fail",
                    "errorCode": err.status,
                    "errorMessage": err.message
                }, {});
                return true;
            } catch ( e ) {
                if ( e.status === ErrorHandler.CODE.MISSING_OUTPUT_FILE ) {
                    throw e;
                } else {
                    return true;
                }
            }
        }

        async function scrapeData ( data, pageKey ) {
            let eId;
            try {
                console.log("Scraping drug with ID=" + data["id"] + ", name=" + data["label"]);
                Logger.log("scrapeData pageKey", pageKey);
                Logger.log("scrapeData data", data);
                let scrapeObj;
                let wildcardCurrId = 1;
                if ( data["type"] === Constants.SPECIFIC_URL || data["type"] === Constants.DEFAULT_URL_TYPE ) {
                    Logger.log("To scrape url type");
                    scrapeObj = new UrlScraper(pagePool[pageKey]["page"], data["url"], data.zipCode, {
                        "dosage": data.dosage,
                        "form": data.form,
                        "label": data.label,
                        "quantity": data.quantity,
                        "genericOrBrand": data.genericOrBrand,
                        "stringVal": data.stringVal,
                        "zipCode": data.zipCode,
                        "type": data["type"]
                    }, pagePool[pageKey]["httpTracker"]);
                } else if ( data["type"] === Constants.ALL_COMBINATIONS ) {
                    Logger.log("To scrape wildcard type");
                    scrapeObj = new WildcardScraper(pagePool[pageKey]["page"], data["url"], data.zipCode, {
                        "dosage": data.dosage,
                        "form": data.form,
                        "label": data.label,
                        "quantity": data.quantity,
                        "genericOrBrand": data.genericOrBrand,
                        "stringVal": data.stringVal,
                        "zipCode": data.zipCode,
                        "type": data["type"]
                    }, pagePool[pageKey]["httpTracker"], eventTracker, data["wildcardStatus"]);
                    const copyData = JSON.parse(JSON.stringify(data));
                    
                    eId = eventTracker.subscribeToEvent(Constants.WILD_CARD_OUTPUT, async ( resp ) => {
                        copyData.id = data.id + "-" + wildcardCurrId++;
                        Logger.log("WILD_CARD_OUTPUT resp", resp);
                        Logger.log("WILD_CARD_OUTPUT copyData", copyData);
                        await saveOutput(resp.dataSet, copyData, resp.actualFilters, resp.status);
                    });
                }
                
                const resp = await scrapeObj.scrapeData();
                if ( data["type"] === Constants.ALL_COMBINATIONS ) {
                    eventTracker.removeEventSubscription(Constants.WILD_CARD_OUTPUT, eId);
                } else {
                    Logger.log("scrapeData resp", resp);
                    await saveOutput(resp.dataSet, data, resp.actualFilters, resp.status);
                }
                
                successCount++;
                pagePool[pageKey]["status"] = "free";
                eventTracker.notifyEvent(Constants.PAGE_SCRAPE_DONE);
                return true;
            } catch ( err ) {
                Logger.error("scrapeData error", err.message);
                if ( err.status === ErrorHandler.CODE.MISSING_OUTPUT_FILE || err.status === ErrorHandler.CODE.PROXY_CONNECTION_ISSUE ) {
                    console.log(err.message);
                    stopScraping();
                    return;
                }
                let acf = {};
                if ( data["type"] === Constants.ALL_COMBINATIONS ) {
                    eventTracker.removeEventSubscription(Constants.WILD_CARD_OUTPUT, eId);
                    Logger.log("scrapeData error acf", err.actualFilters);
                    if ( err.actualFilters ) {
                        acf = err.actualFilters;
                    }
                }
                await writeErrorLogs(data, err, acf);
                failCount++;
                pagePool[pageKey]["status"] = "free";
                eventTracker.notifyEvent(Constants.PAGE_SCRAPE_DONE);
                return true;
            }
        }

        async function saveOutput ( resp, data, actualFilters, status ) {
            try {
                Logger.log("Before data save resp size", resp.length);
                await OutputManager.saveData(resp, data, actualFilters, status);
                Logger.log("After data save");
            } catch ( e ) {
                throw e;
            }
        }

        function stopScraping () {
            Logger.log("To close browser");
            eventTracker.removeAllSubscriptions();
            if ( browser ) {
                browser.close();
            }
            if ( stayAwake ) {
                stayAwake.allow(function(err, data) {
                    if ( data == 0 ) {
                        Logger.log('Will sleep automatically');
                    }
                });
            }
        }
        setTimeout(() => {
            (async () => {
                try {
                    const debugFilePath = InputManager.checkConfigFile();
                    Log.createLogger(debugFilePath);
                    InputManager.validateData();
                } catch ( e ) {
                    console.log(e.message);
                    return;
                }
    
                try {
                    await InputManager.prepareFilterMap();
                } catch ( e ) {
                    Logger.log("prepareFilterMap e", e.message);
                } finally {
                    InputManager.prepareData().then(( resp ) => {
                        formattedData = resp.ipData;
                        proxyHost = resp.proxyHost;
                        proxyPort = resp.proxyPort
                        ipFileName = resp.ipFileName;
                        properties = resp.properties;
                        
                        startScraping(resp);
                    }).catch(( err ) => {
                        console.log(err.message);
                        stopScraping();
                        return;
                    });
                }
            })();
        }, 1000);
    });
}

(async () => {
    Logger.log("Starting the Bot, please wait...");
    await main();
})();
