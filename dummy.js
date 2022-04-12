// HTTPTRACKER.js

 // if ( this.#scrapeType === Constants.SPECIFIC_URL ) {
//     if ( respData != null ) {
//         EventsManager.notifyEvent(Constants.SCRAPE_FOR_ZIP_COMPLETED, {
//             "data": respData
//         });
//     } else {
//         EventsManager.notifyEvent(Constants.SCRAPE_FOR_ZIP_FAILED, {
//             "data": null
//         });
//     }
// } else {
//     if ( this.#wildCardScrapeType === Constants.QUANTITY_TYPE ) {
//         EventsManager.notifyEvent(Constants.SCRAPE_QUANTITIES, {
//             "isFresh": false,
//             "resp": respData
//         });
//     } else if ( this.#wildCardScrapeType === Constants.DOSAGE_TYPE ) {
//         this.setWildCardScrapeType(Constants.QUANTITY_TYPE);
//         EventsManager.notifyEvent(Constants.SCRAPE_QUANTITIES, {
//             "isFresh": true,
//             "resp": respData
//         });
//     } else if ( this.#wildCardScrapeType === Constants.FORM_TYPE ) {
//         this.setWildCardScrapeType(Constants.DOSAGE_TYPE);
//         EventsManager.notifyEvent(Constants.SCRAPE_DOSAGES, {
//             "isFresh": true,
//             "resp": respData
//         });
//     } else if ( this.#wildCardScrapeType === Constants.LABEL_TYPE ) {
//         this.setWildCardScrapeType(Constants.FORM_TYPE);
//         EventsManager.notifyEvent(Constants.SCRAPE_FORMS, {
//             "isFresh": true,
//             "resp": respData
//         });
//     }
// }



// INDEX

// [page] = await browser.pages();
// await page.setViewport({ width: 1366, height: 768});
// await page.setRequestInterception(true);

// // Handle authentication error

// await page.authenticate({
//     username: properties.get("proxy.auth.username"),
//     password: properties.get("proxy.auth.password")
// });


// const resp = await DataScraper.scrapeUrl(data["url"], data["type"], page, {
//     "dosage": data.dosage,
//     "form": data.form,
//     "label": data.label,
//     "quantity": data.quantity,
//     "genericOrBrand": data.genericOrBrand,
//     "stringVal": data.stringVal,
//     "zipCode": data.zipCode
// });













// await this.page.click('button[data-qa="price_sorter"]');
                    // et12 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_FOR_ZIP_COMPLETED, async ( resp ) => {
                    //     console.log("scrapeNextFilter resp", resp);
                    //     clearEvents.call(this);
                    //     setTimeout(async () => {
                    //         let dataVal;
                    //         try {
                    //             dataVal = this.retrieveData();
                    //         } catch ( e ) {
                    //             console.error("Error wildcard e", e);
                    //         } finally {
                    //             console.log("scrapeNextFilter dataVal", dataVal);
                    //             if ( dataVal ) {
                    //                 this.#globalEventTracker.notifyEvent(Constants.WILD_CARD_OUTPUT, dataVal);
                    //             }
                    //             resolve(options);
                    //         }
                    //     }, 17000);
                    // });
                    // et22 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_FOR_ZIP_FAILED, () => {
                    //     console.log("scrapeNextFilter err");
                    //     clearEvents.call(this);
                    //     setTimeout(() => {
                    //         reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                    //     }, 7000);
                    // });

                    // let et12;
                    // let et22;
            
                    // function clearEvents () {
                    //     if ( et12 ) {
                    //         this.eventTracker.removeEventSubscription(Constants.SCRAPE_FOR_ZIP_COMPLETED, et12);
                    //     }
                    //     if ( et22 ) {
                    //         this.eventTracker.removeEventSubscription(Constants.SCRAPE_FOR_ZIP_FAILED, et22);
                    //     }
                    // }


// const startEvt = this.eventTracker.subscribeToEvent(Constants.PRICE_REQUEST_TRIGGERED, () => {
                        //     isTriggered = true;
                        // });
                        // const eId1 = this.eventTracker.subscribeToEvent(Constants.ZIP_CODE_SET_SUCCESS, () => {
                        //     this.httpTracker.setPriceAPIStat(false);
                        //     this.eventTracker.removeEventSubscription(Constants.ZIP_CODE_SET_SUCCESS, eId1);
                        //     this.eventTracker.removeEventSubscription(Constants.ZIP_CODE_SET_ERROR, eId2);

                        //     let tmRef = setTimeout(async () => {
                        //         let errEle;
                        //         try {
                        //             errEle = await this.page.$("#uat-location-selector div ~ div div ~ div ~ div ~ div ~ div");
                        //         } catch ( e ) {
                        //             reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                        //             return;
                        //         }
                        //         if ( errEle ) {
                        //             let innerHtml;
                        //             try {
                        //                 innerHtml = await this.page.$eval('#uat-location-selector div ~ div div ~ div ~ div ~ div ~ div', element => element.innerHTML);
                        //             } catch ( e ) {
                        //                 reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                        //                 return;
                        //             }
                        //             if ( innerHtml === ErrorHandler.MESSAGE.VALID_LOC_TEXT && this.zipCodeSetRetryCount <= 4 ) {
                        //                 try {
                        //                     clearEvents.call(this);
                        //                     this.setZipAndGetData().then(( resp ) => {
                        //                         resolve(resp);
                        //                     }).catch(( err ) => {
                        //                         reject(err);
                        //                     });
                        //                 } catch ( e ) {
                        //                     reject(e);
                        //                 }
                        //             } else {
                        //                 if ( !isTriggered ) {
                        //                     if ( this.zipCodeSetRetryCount <= 4 ) {
                        //                         try {
                        //                             clearEvents.call(this);
                        //                             this.setZipAndGetData().then(( resp ) => {
                        //                                 resolve(resp);
                        //                             }).catch(( err ) => {
                        //                                 reject(err);
                        //                             });
                        //                         } catch ( e ) {
                        //                             reject(e);
                        //                         }
                        //                     } else {
                        //                         reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                        //                     }
                        //                 }
                        //             }
                        //         } else {
                        //             // console.log("after 5 secs no loc set error and price API triggered is", isTriggered);
                        //             if ( !isTriggered ) {
                        //                 if ( this.zipCodeSetRetryCount <= 4 ) {
                        //                     try {
                        //                         this.httpTracker.setPriceAPIStat(false);
                        //                         clearEvents.call(this);
                        //                         this.setZipAndGetData().then(( resp ) => {
                        //                             resolve(resp);
                        //                         }).catch(( err ) => {
                        //                             reject(err);
                        //                         });
                        //                     } catch ( e ) {
                        //                         reject(e);
                        //                     }
                        //                 } else {
                        //                     reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                        //                 }
                        //             }
                        //         }
                        //     }, 5000);

                        //     function  clearEvents () {
                        //         try {
                        //             if ( tmRef ) {
                        //                 clearTimeout(tmRef);
                        //                 tmRef = null;
                        //             }
                        //             if ( et12 ) {
                        //                 this.eventTracker.removeEventSubscription(Constants.SCRAPE_FOR_ZIP_COMPLETED, et12);
                        //             }
                        //             if ( et22 ) {
                        //                 this.eventTracker.removeEventSubscription(Constants.SCRAPE_FOR_ZIP_FAILED, et22);
                        //             }
                        //             if ( startEvt ) {
                        //                 this.eventTracker.removeEventSubscription(Constants.PRICE_REQUEST_TRIGGERED, startEvt);
                        //             }
                        //         } catch ( e ) {
                        //             // console.error("error 333333333", e);
                        //             reject(e);
                        //         }
                        //     }

                        //     const et12 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_FOR_ZIP_COMPLETED, async ( resp ) => {
                        //         console.log("scrape for zip completed", resp);
                        //         try {
                        //             clearEvents.call(this);
                        //             const content = await this.page.content();
                        //             const flData = this.validateFilters(cheerio.load(content));
                        //             console.log("flData", flData);
                        //             resolve({
                        //                 "data": resp.data,
                        //                 flData
                        //             });
                        //         } catch ( e ) {
                        //             console.error("error 44444444", e);
                        //             reject(e);
                        //         }
                        //     });
                        //     const et22 = this.eventTracker.subscribeToEvent(Constants.SCRAPE_FOR_ZIP_FAILED, () => {
                        //         clearEvents.call(this);
                        //         reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                        //     });
                            
                        // });
                        // const eId2 = this.eventTracker.subscribeToEvent(Constants.ZIP_CODE_SET_ERROR, () => {
                        //     this.eventTracker.removeEventSubscription(Constants.ZIP_CODE_SET_SUCCESS, eId1);
                        //     this.eventTracker.removeEventSubscription(Constants.ZIP_CODE_SET_ERROR, eId2);
                        //     this.eventTracker.removeEventSubscription(Constants.PRICE_REQUEST_TRIGGERED, startEvt);
                        //     if ( this.zipCodeSetRetryCount <= 4 ) {
                        //         try {
                        //             this.setZipAndGetData().then(( resp ) => {
                        //                 resolve(resp);
                        //             }).catch(( err ) => {
                        //                 reject(err);
                        //             });
                        //         } catch ( e ) {
                        //             reject(e);
                        //         }
                        //     } else {
                        //         reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                        //     }
                        // });


// const eId21 = this.eventTracker.subscribeToEvent(Constants.ALL_REQUESTS_DONE, async () => {
                            // console.log("scraper all requests done", zipSuccess, zipError, priceSuccess, priceError);
                            // this.httpTracker.stopRequestTracking();
                            // try {
                            //     await this.page.evaluate('document.getElementById("modal-root").innerHTML = ""');
                            // } catch ( e ) {

                            // }
                            
                            // clearEvents.call(this);
                            // if ( priceSuccess ) {
                            //     const content = await this.page.content();
                            //     const flData = this.validateFilters(cheerio.load(content));
                            //     console.log("flData", flData);
                            //     resolve({
                            //         "data": priceData,
                            //         flData
                            //     });
                            // } else {
                            //     if ( this.zipCodeSetRetryCount <= 4 ) {
                            //         this.setZipAndGetData().then(( resp ) => {
                            //             resolve(resp);
                            //         }).catch(( err ) => {
                            //             reject(err);
                            //         });
                            //     } else {
                            //         reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                            //     }
                            // }
                        // });

                        // if ( eId21 ) {
                        //     this.eventTracker.removeEventSubscription(Constants.ALL_REQUESTS_DONE, eId21);
                        // }



                        // const eId21 = this.eventTracker.subscribeToEvent(Constants.ALL_REQUESTS_DONE, async () => {
                        //     console.log("Wildcardscraper all requests done");
                        //     this.httpTracker.stopRequestTracking();
                        //     try {
                        //         await this.page.evaluate('document.getElementById("modal-root").innerHTML = ""');
                        //     } catch ( e ) {
                        //         console.log("revertWhenAllRequestsDone e", e);
                        //     }
                        //     this.eventTracker.removeEventSubscription(Constants.ALL_REQUESTS_DONE, eId21);
                        //     resolve();
                        // });





                        // setTimeout(async () => {
                        //     let locModalEle;
                        //     try {
                        //         locModalEle = await this.page.$("#locationModalInput");
                        //     } catch ( e ) {
                        //         console.log("setZipAndGetData e", e);
                        //         reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                        //         return;
                        //     }
                        //     if ( locModalEle === null ) {
                        //         if ( this.zipCodeSetInvokeCount <= 4 ) {
                        //             try {
                        //                 let firstLocEle = await this.page.$(HtmlSelectors.no_loc_set_btn);
                        //                 let secLocEle = await this.page.$(HtmlSelectors.after_loc_set_btn);
                        //                 if ( firstLocEle ) {
                        //                     await this.page.click(HtmlSelectors.no_loc_set_btn);
                        //                 } else if ( secLocEle ) {
                        //                     await this.page.click(HtmlSelectors.after_loc_set_btn);
                        //                 }
                        //             } catch ( e ) {
                        //                 reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                        //                 return;
                        //             }
                        //             this.setZipAndGetData().then(( resp ) => {
                        //                 resolve(resp);
                        //             }).catch(( err ) => {
                        //                 reject(err);
                        //             });
                        //         } else {
                        //             reject(new ScrapingError(ErrorHandler.MESSAGE.ZIP_SET_FAILED, ErrorHandler.CODE.ZIP_SET_FAILED));
                        //         }
                        //     } else {
            
                                
                        //     }
                        // }, 1400);



                        // #checkStat ( type, data, options ) {
                        //     if ( type === "continue" ) {
                        //         if ( data && data["isFresh"] ) {
                        //             return true;
                        //         } else {
                        //             return false;
                        //         }
                        //     } else {
                        //         if ( options.length === 0 ) {
                        //             return true;
                        //         } else {
                        //             return false;
                        //         }
                        //     }
                        // }



                        // startTrackingRequests () {
                        //     this.#requestCount = 0;
                        //     this.#responseCount = 0;
                        //     this.#reqList = [];
                        //     this.#requestTracking = true;
                        // }
                    
                        // stopRequestTracking () {
                        //     this.#requestCount = 0;
                        //     this.#responseCount = 0;
                        //     this.#requestTracking = false;
                        // }

                        // setPriceAPIStat ( stat ) {
                        //     this.#priceAPIStat = stat;
                        // }



                        // <div><div class="container-1tfcB containerExtended-2ouUg"><div class="container-19AzL"><i class="icon-magnify-1rvMQ icon-1hx-P icon-2Lhfz"></i><label><span class="viz-hide">Search GoodRx.com.</span><input autocomplete="off" class="input-1dtkC" placeholder="Type your drug name (like Atorvastatin, Sildenafil, etc)" title="Please enter a drug name" type="search" value=""></label></div><a class="viz-hide" href="#a11y-hdr-nav">Skip recently viewed pages, skip to main site navigation.</a><div class="scrollable-1jBPV"><nav aria-label="Supplementary Search Navigation" class="nav-3x7ab"><ul><li class="li-3SddK"><div class="title-1ngad"><span class="viz-hide">Your </span>Recently Viewed<span class="viz-hide"> pages list.</span></div><button class="clearAll-3uEJS" type="button">Clear All<span class="viz-hide"> items from your recently viewed pages list.</span></button></li><li class="li-1rIw4"><span class="link-2qtDL" role="button" tabindex="0"><img aria-hidden="true" role="presentation" tabindex="-1" alt="" class="img-3Irw8" height="45" src="https://www.grxstatic.com/d4fuqqd5l3dbz/products/tms/DrugItem_18789.JPG" width="65"><div><span class="title-1hAF2">hydrocodone / acetaminophen (Generic Lortab Hycet Xodol Norco Vicodin Maxidone)</span><span aria-hidden="true" role="presentation" tabindex="-1" class="subTitle-Ds8ut">20 tablets 5mg/325mg</span></div></span><button aria-label="Click to remove the previous link from your recently viewed list." class="icon-38TLx" type="button">x</button></li></ul><div class="footer-1u0nU"><label class="saveSearches-3G38N"><input class="checkBox-5JZYV" type="checkbox" checked="">Save recent searches</label></div></nav></div></div></div>

// const btnEle = await this.page.$("[data-qa='location_container'] button");
// if ( btnEle ) {
// const innerHtml = await this.page.$eval("[data-qa='location_container'] button", element => element.innerHTML);
// if ( innerHtml.indexOf(ErrorHandler.MESSAGE.SET_LOC_TEXT) >= 0 ) {
// return false;
// }
// return true;
// }

// return true;



// let qVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-quantity div span").innerText');
// let dVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-dosage div span").innerText');
// let fVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-form div span").innerText');
// let bVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-brand div span").innerText');

// console.log("validateFilters qVal dVal fVal bVal", qVal, dVal, fVal, bVal);

// let brandInputCompVal;
// let brandPageCompVal;

// if ( !bVal ) {
//     bVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-brand div").innerText');
//     bVal = bVal.trim();
//     // bVal = this.metaData["genericOrBrand"];
//     brandInputCompVal = this.metaData.stringVal;
// } else {
//     brandInputCompVal = this.metaData.genericOrBrand;
// }
// brandPageCompVal = bVal;

// actualFilters = {
//     "quantity": qVal,
//     "form": fVal,
//     "dosage": dVal,
//     "label": bVal
// };








// <div class="QSIPopOver SI_4YE6UZfiQYe05DM_PopOverContainer" style="position: fixed; top: 87px; left: 20px; z-index: 2000000006;"><div style="top: 0px; left: 54px; position: absolute; z-index: 2000000002; width: 58px; height: 70px; background-color: transparent; border-width: 0px; border-color: rgb(51, 51, 51); border-style: solid; border-radius: 0px; display: block; outline: none;" tabindex="0"><div style="position: absolute; top: 0px; left: 0px; width: 58px; height: 70px; overflow: hidden; display: block;"></div></div><div style="top: 0px; left: 54px; position: absolute; z-index: 2000000003; width: 58px; height: 70px; background-color: transparent; border-width: 0px; border-color: rgb(51, 51, 51); border-style: solid; border-radius: 0px; display: block;" tabindex="0"><div style="position: absolute; top: 0px; left: 0px; width: 58px; height: 70px; overflow: hidden; display: block;"></div></div><div style="top: 44px; left: 0px; position: absolute; z-index: 2000000000; width: 310px; height: 416px; background-color: rgb(117, 117, 117); border-width: 1px; border-color: rgb(0, 0, 0); border-style: solid; border-radius: 0px; display: block;" tabindex="0"><img src="https://siteintercept.qualtrics.com/WRQualtricsShared/Graphics/siteintercept/popup_shadow_transparent.png" alt="" style="width: 374px; max-width: 374px; height: 501px; top: -42px; left: -32px; position: absolute;"><div style="position: absolute; top: 0px; left: 0px; width: 310px; height: 416px; overflow: hidden; display: block;"></div></div><div style="top: 47px; left: 3px; position: absolute; z-index: 2000000001; width: 302px; height: 408px; background-color: rgb(255, 255, 255); border-width: 2px; border-color: transparent; border-style: solid; border-radius: 0px; display: block;" tabindex="0"><div style="position: absolute; top: 0px; left: 0px; width: 302px; height: 408px; overflow: hidden; display: block;"><div class="scrollable" style="width: 302px; height: 408px; transform: translateZ(0px);"><iframe data-src="https://goodrx.iad1.qualtrics.com/jfe/form/SV_9TF4aelg0OyB69o?Q_CHL=si&amp;Q_CanScreenCapture=1" width="100%" height="100%" frameborder="0" name="survey-iframe-SI_4YE6UZfiQYe05DM"></iframe></div></div></div><div style="top: 56px; left: 270px; position: absolute; z-index: 2000000004; width: 28px; height: 32px; background-color: transparent; border-width: 0px; border-color: rgb(0, 0, 0); border-style: solid; border-radius: 0px; display: block; opacity: 0.7; cursor: pointer;" tabindex="0"><div style="position: absolute; top: 0px; left: 0px; width: 28px; height: 32px; overflow: hidden; display: block;"><img src="https://static-assets.qualtrics.com/static/prototype-ui-modules/SharedGraphics/siteintercept/svg-close-btn-black-2.svg"></div></div></div>



// const respData = [];
//         const priceMap = {};
//         let idpMin;
//         let idpMax;
//         if (data["non_nabp_price"]) {
//             idpMin = data["non_nabp_price"]["min_price"];
//             if (idpMin) {
//                 idpMin = idpMin.toFixed(2);
//             }
//             idpMax = data["non_nabp_price"]["max_price"];
//             if (idpMax) {
//                 idpMax = idpMax.toFixed(2);
//             }
//         }
//         if (data && data["results"] && data["results"].length > 0) {
//             const results = data["results"];
//             for (let i = 0; i < results.length; i++) {
//                 const pharmaName = results[i]["pharmacy"]["name"];
//                 let price;
//                 let type = "";
//                 const priceWithType = new Map();
//                 const prices = results[i]["prices"];
//                 for (let j = 0; j < prices.length; j++) {
//                     priceWithType.set(prices[j]["type"], prices[j]["price"].toFixed(2));
//                 }
//                 if (priceWithType.has("COUPON")) {
//                     type = "COUPON";
//                     price = priceWithType.get("COUPON");
//                 } else if (priceWithType.has("CASH")) {
//                     type = "CASH";
//                     price = priceWithType.get("CASH");
//                 } else if (priceWithType.has("GOLD")) {
//                     type = "GOLD";
//                     price = priceWithType.get("GOLD");
//                 } else if (priceWithType.size > 0) {
//                     type = priceWithType.keys().next().value;
//                     price = priceWithType.get(type);
//                 }
//                 respData.push({
//                     "pharmaName": pharmaName,
//                     "price": price ? "$ " + price : "",
//                     "type": type,
//                 })
//             }
//             priceMap.results = respData;
//         }
//         priceMap.idpMin = idpMin ? "$ " + idpMin : "";
//         priceMap.idpMax = idpMax ? "$ " + idpMax : "";
//         return priceMap;



// let qVal;
//             let dVal;
//             let fVal;
//             let bVal;
//             let brandInputCompVal;
//             let brandPageCompVal;

//             let bValEle = await this.page.$("#uat-dropdown-container-brand div span");
//             let qValEle = await this.page.$("#uat-dropdown-container-quantity div span");
//             let dValEle = await this.page.$("#uat-dropdown-container-dosage div span");
//             let fValEle = await this.page.$("#uat-dropdown-container-form div span");


//             if ( bValEle ) {
//                 bVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-brand div span").innerText');
//                 brandInputCompVal = this.metaData.genericOrBrand;
//             } else {
//                 bVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-brand div").innerText');
//                 bVal = bVal.trim();
//                 brandInputCompVal = this.metaData.stringVal;
//             }
//             brandPageCompVal = bVal;

//             if ( qValEle ) {
//                 qVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-quantity div span").innerText');
//             } else {
//                 qVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-quantity div").innerText');
//             }

//             if ( dValEle ) {
//                 dVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-dosage div span").innerText');
//             } else {
//                 dVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-dosage div").innerText');
//             }

//             if ( fValEle ) {
//                 fVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-form div span").innerText');
//             } else {
//                 fVal = await this.page.evaluate('document.querySelector("#uat-dropdown-container-form div").innerText');
//             }

//             console.log("validateFilters qVal dVal fVal bVal", qVal, dVal, fVal, bVal);



















// const puppeteer = require('puppeteer');
// const cheerio = require('cheerio');
// const Constants = require('./constants');
// const EventsManager = require('./events-manager');
// const ErrorHandler = require('./error-handler');
// const InternetAvailable = require("internet-available");

// const DataScraper = (() => {

//     class ScrapingError extends Error {
// 		constructor(message, status, ...params) {
// 			super(...params);
// 			if (Error.captureStackTrace) {
// 				Error.captureStackTrace(this, ScrapingError);
// 			}

// 			// console.log("message", message);

// 			this.name = 'ScrapingError';
// 			this.message = message;
// 			this.status = status;
// 			this.timestamp = new Date();
// 		}
// 	}

//     let scrapeReqType;
//     let browserPage;
//     let currUrl;
//     let browseMetaData;
//     let dataSet = [];
//     let actualFilters;
//     let priceAPIStat = false;

//     let $jq;
//     let wildCardScrapeType;

//     async function continueWithPage () {
//         try {
//             const content = await browserPage.content();
            
//             $jq = cheerio.load(content);
//             const isValid = extractDataFromPage($jq);
//             // console.log("continueWithPage isValid", isValid);
//             if ( isValid ) {
//                 // console.log("scrapeReqType", scrapeReqType);
//                 if ( scrapeReqType === Constants.SPECIFIC_URL ) {
//                     return true;
//                 } else {
//                     mimicUser();
//                     EventsManager.subscribeToEvent(Constants.SCRAPE_LABELS_COMPLETED, ( data ) => {
//                         // console.log("All options done");
//                     });
//                 }
//             } else {
//                 throw new ScrapingError("Bad data", 400);
//             }
//         } catch ( errref ) {
//             // console.log("errref", errref);
//             throw errref;
//         }
//     }

//     async function getPageFilters () {
//         const content = await browserPage.content();
//         $jq = cheerio.load(content);
//         validateFilters($jq);
//     }

//     let zipCodeSetRetryCount;

//     function setLocInput ( zipCode ) {
//         return new Promise(( resolve, reject ) => {
//             setTimeout(async () => {
//                 ++zipCodeSetRetryCount;
//                 // console.log("zipCodeSetRetryCount", zipCodeSetRetryCount);
//                 let locModalEle;
//                 try {
//                     locModalEle = await browserPage.$("#locationModalInput");
//                 } catch ( e ) {
//                     reject(new ScrapingError("Zipcode set failed", 456));
//                     return;
//                 }
//                 if ( locModalEle === null ) {
//                     if ( zipCodeSetRetryCount <= 4 ) {
//                         try {
//                             await browserPage.click("[data-qa='set_location_button']");
//                             // let locParEle = await browserPage.evaluateHandle(() =>
//                             //     document.querySelector("[data-qa='set_location_button']")
//                             // );
//                             // locParEle.click();
//                         } catch ( e ) {
//                             reject(new ScrapingError("Zipcode set failed", 456));
//                             return;
//                         }
//                         setLocInput(zipCode).then(( resp ) => {
//                             resolve(resp);
//                         }).catch(( err ) => {
//                             reject(err);
//                         });
//                     } else {
//                         reject(new ScrapingError("Zipcode set failed", 456));
//                     }
//                 } else {
//                     // let btnEle;
//                     try {
//                         await browserPage.focus('#locationModalInput');
//                         await browserPage.keyboard.down('Control');
//                         await browserPage.keyboard.press('A');
//                         await browserPage.keyboard.up('Control');
//                         await browserPage.keyboard.press('Backspace');
//                         await browserPage.keyboard.type(zipCode);
//                     } catch ( e ) {
//                         reject(new ScrapingError("Zipcode format is not correct", 456));
//                         return;
//                     }
//                     // try {
//                     //     btnEle = await browserPage.evaluateHandle(() =>
//                     //         document.querySelector("#uat-location-submit")
//                     //     );
//                     // } catch ( e ) {
//                     //     reject(new ScrapingError("Zipcode set failed", 456));
//                     //     return;
//                     // }
                    
//                     setTimeout( async () => {
//                         let isTriggered = false;
//                         try {
//                             await browserPage.click("#uat-location-submit");
//                         } catch ( e ) {
//                             reject(new ScrapingError("Zipcode set failed", 456));
//                             return;
//                         }

//                         const startEvt = EventsManager.subscribeToEvent(Constants.PRICE_REQUEST_TRIGGERED, () => {
//                             // console.log("Triggered price API after zipcode set");
//                             isTriggered = true;
//                         });
//                         const eId1 = EventsManager.subscribeToEvent(Constants.ZIP_CODE_SET_SUCCESS, () => {
//                             // console.log("loc suc rec", eId1, eId2);
//                             // console.log("setLocInput count", zipCodeSetRetryCount);
//                             priceAPIStat = false;
//                             EventsManager.removeEventSubscription(Constants.ZIP_CODE_SET_SUCCESS, eId1);
//                             EventsManager.removeEventSubscription(Constants.ZIP_CODE_SET_ERROR, eId2);

//                             let tmRef = setTimeout(async () => {
//                                 let errEle;
//                                 try {
//                                     errEle = await browserPage.$("#uat-location-selector div ~ div div ~ div ~ div ~ div ~ div");
//                                 } catch ( e ) {
//                                     reject(new ScrapingError("Zipcode set failed", 456));
//                                     return;
//                                 }
//                                 if ( errEle ) {
//                                     let innerHtml;
//                                     try {
//                                         innerHtml = await browserPage.$eval('#uat-location-selector div ~ div div ~ div ~ div ~ div ~ div', element => element.innerHTML);
//                                     } catch ( e ) {
//                                         reject(new ScrapingError("Zipcode set failed", 456));
//                                         return;
//                                     }
//                                     // console.log("after loc resp error", innerHtml);
//                                     if ( innerHtml === "Must be a valid location in the United States" && zipCodeSetRetryCount <= 4 ) {
//                                         try {
//                                             clearEvents();
//                                             setLocInput(zipCode).then(( resp ) => {
//                                                 resolve(resp);
//                                             }).catch(( err ) => {
//                                                 reject(err);
//                                             });
//                                         } catch ( e ) {
//                                             // console.error("error 222222222", e);
//                                             reject(e);
//                                         }
//                                     } else {
//                                         // console.log("after 5 secs err ele but no err", isTriggered);
//                                         if ( !isTriggered ) {
//                                             if ( zipCodeSetRetryCount <= 4 ) {
//                                                 try {
//                                                     clearEvents();
//                                                     setLocInput(zipCode).then(( resp ) => {
//                                                         resolve(resp);
//                                                     }).catch(( err ) => {
//                                                         reject(err);
//                                                     });
//                                                 } catch ( e ) {
//                                                     // console.error("error 111111111", e);
//                                                     reject(e);
//                                                 }
//                                             } else {
//                                                 reject(new ScrapingError("Zipcode set failed", 456));
//                                             }
//                                         }
//                                     }
//                                 } else {
//                                     // console.log("after 5 secs no loc set error and price API triggered is", isTriggered);
//                                     if ( !isTriggered ) {
//                                         if ( zipCodeSetRetryCount <= 4 ) {
//                                             try {
//                                                 priceAPIStat = true;
//                                                 clearEvents();
//                                                 setLocInput(zipCode).then(( resp ) => {
//                                                     resolve(resp);
//                                                 }).catch(( err ) => {
//                                                     reject(err);
//                                                 });
//                                             } catch ( e ) {
//                                                 // console.error("error 333333333", e);
//                                                 reject(e);
//                                             }
//                                         } else {
//                                             reject(new ScrapingError("Zipcode set failed", 456));
//                                         }
//                                     }
//                                 }
//                             }, 5000);

//                             function  clearEvents () {
//                                 try {
//                                     if ( tmRef ) {
//                                         clearTimeout(tmRef);
//                                         tmRef = null;
//                                     }
//                                     if ( et12 ) {
//                                         EventsManager.removeEventSubscription(Constants.SCRAPE_FOR_ZIP_COMPLETED, et12);
//                                     }
//                                     if ( et22 ) {
//                                         EventsManager.removeEventSubscription(Constants.SCRAPE_FOR_ZIP_FAILED, et22);
//                                     }
//                                     if ( startEvt ) {
//                                         EventsManager.removeEventSubscription(Constants.PRICE_REQUEST_TRIGGERED, startEvt);
//                                     }
//                                 } catch ( e ) {
//                                     // console.error("error 333333333", e);
//                                     reject(e);
//                                 }
//                             }

//                             const et12 = EventsManager.subscribeToEvent(Constants.SCRAPE_FOR_ZIP_COMPLETED, async ( resp ) => {
//                                 // console.log("scrape for zip completed");
//                                 try {
//                                     clearEvents();
//                                     const content = await browserPage.content();
//                                     const flData = validateFilters(cheerio.load(content));
//                                     resolve({
//                                         "data": resp.data,
//                                         flData
//                                     });
//                                 } catch ( e ) {
//                                     // console.error("error 44444444", e);
//                                     reject(e);
//                                 }
//                             });
//                             const et22 = EventsManager.subscribeToEvent(Constants.SCRAPE_FOR_ZIP_FAILED, () => {
//                                 clearEvents();
//                                 reject(new ScrapingError("Zipcode set failed", 456));
//                             });
                            
//                         });
//                         const eId2 = EventsManager.subscribeToEvent(Constants.ZIP_CODE_SET_ERROR, () => {
//                             EventsManager.removeEventSubscription(Constants.ZIP_CODE_SET_SUCCESS, eId1);
//                             EventsManager.removeEventSubscription(Constants.ZIP_CODE_SET_ERROR, eId2);
//                             EventsManager.removeEventSubscription(Constants.PRICE_REQUEST_TRIGGERED, startEvt);
//                             if ( zipCodeSetRetryCount <= 4 ) {
//                                 try {
//                                     setLocInput(zipCode).then(( resp ) => {
//                                         resolve(resp);
//                                     }).catch(( err ) => {
//                                         reject(err);
//                                     });
//                                 } catch ( e ) {
//                                     // console.error("error 555555555", e);
//                                     reject(e);
//                                 }
//                             } else {
//                                 reject(new ScrapingError("Zipcode set failed", 456));
//                             }
//                         });
//                     }, 1000);
//                 }
//             }, 1400);
//         });
//     }

//     async function setLocation ( zipCode ) {
//         try {
//             zipCodeSetRetryCount = 0;
//             await browserPage.click("[data-qa='set_location_button']");
//             // let locParEle = await browserPage.evaluateHandle(() =>
//             //     document.querySelector("[data-qa='set_location_button']")
//             // );
//             // locParEle.click();
//             // console.log("Data fetching started, Please wait ...");
//             const dataVal = await setLocInput(zipCode);
//             if ( !dataVal["flData"]["status"] ) {
//                 throw new ScrapingError(dataVal["flData"]["message"], 400);
//             }
//             return dataVal.data;
//         } catch ( e ) {
//             if ( e.status ) {
//                 throw e;
//             } else {
//                 throw new ScrapingError("Zipcode set failed", 456);
//             }
//         }
//     }

//     function dummy () {
//         return new Promise(( resolve, reject ) => {
//             EventsManager.subscribeToEvent(Constants.BOT_MESSAGE_VERIFIED, ( resp ) => {
//                 resolve();
//                 // console.log("Here in verify");
//                 // try {
//                 //     setTimeout(async () => {
//                 //         resolve();
//                 //         // let ele = await browserPage.evaluateHandle(() =>
//                 //         //     document.querySelector('[aria-label="Press & Hold"] div ~ div p')
//                 //         // );
//                 //         // ele.click();
//                 //         // await browserPage.click('[aria-label="Press & Hold"] div ~ div p', {delay: 20000});
//                 //     }, 5000);
//                 // } catch ( e ) {
//                     // console.log("dummy e", e);
//                 // }
//             });
//             // const element = await browserPage.$x("//p[text()='Press & Hold']");
//             // console.log("element[0]", element[0]);
//         });
//     }

//     async function checkIfURLValid () {
//         try {
//             const err404Ele = await browserPage.$("#error-404");
//             const notFoundele = await browserPage.$("#uat-404-content-header-container");
//             const roboEle = await browserPage.$("body section div ~ div h1");
//             const blockedOutsideUsEle = await browserPage.$("body section.error-message");

//             if ( err404Ele || notFoundele || roboEle || blockedOutsideUsEle ) {
//                 // console.log("Possible Page error");
//             }
//             if ( roboEle ) {
//                 const innerHtml = await browserPage.$eval('body section div ~ div h1', element => element.innerHTML);
//                 if ( innerHtml === "Please verify you are a human" ) {
//                     // console.log("BOT message up");
//                     await dummy();
//                     throw new ScrapingError(ErrorHandler.MESSAGE.BLOCKED_IP, ErrorHandler.CODE.CONNECTION_FORBIDDEN);
//                     // Handle better
//                 } else {
//                     return true;
//                 }
//             } else if ( err404Ele || notFoundele ) {
//                 // console.log("URL not found");
//                 throw new ScrapingError(ErrorHandler.MESSAGE.INVALID_INPUT, ErrorHandler.CODE.DATA_NOT_FOUND);
//             } else if ( blockedOutsideUsEle ) {
//                 // console.log("Blocked outside US");
//                 throw new ScrapingError(ErrorHandler.MESSAGE.BLOCKED_OUTSIDE_US, ErrorHandler.CODE.CONNECTION_FORBIDDEN);
//             } else {
//                 return true;
//             }
//         } catch ( e ) {
//             throw e;
//         }
//     }

//     async function checkIfDefaultDataIsAvailable () {
//         try {
//             const locContnr = await browserPage.$("[data-qa='location_container']");
//             const priceRow = await browserPage.$("[data-qa='price_row']");

//             if ( locContnr == null && priceRow == null ) {
//                 throw new ScrapingError(ErrorHandler.MESSAGE.NO_DATA_AVAILABLE, ErrorHandler.CODE.NO_DATA);
//             } else {
//                 return true;
//             }
//         } catch ( e ) {
//             throw e;
//         }
//     }

//     async function checkIfLocationSet () {
//         try {
//             const btnEle = await browserPage.$("[data-qa='location_container'] button");
//             if ( btnEle ) {
//                 const innerHtml = await browserPage.$eval("[data-qa='location_container'] button", element => element.innerHTML);
//                 if ( innerHtml.indexOf("Set your location") >= 0 ) {
//                     return false;
//                 }
//                 return true;
//             }
            
//             return true;
//         } catch ( e ) {
//             throw e;
//         }
//     }

//     async function clearBrowser() {
//         try {
//             const client = await browserPage.target().createCDPSession();
//             await client.send('Network.clearBrowserCookies');
//         } catch (e) {
//             throw e;
//         }
//     }
    
//     async function loadPage ( url, zipCode ) {
//         try {
//             await clearBrowser();
//             await browserPage.goto(url, {
//                 waitUntil: 'load',
//                 timeout: 0
//             });
//             const isValidPage = await checkIfURLValid();
//             // console.log("isValidPage", isValidPage);
//             const dataState = await checkIfDefaultDataIsAvailable();
//             if ( !dataState ) {
//                 dataSet = [];
//                 return true;
//             }
//             const isZipCodeSet = await checkIfLocationSet();
//             if ( isValidPage && !isZipCodeSet ) {
//                 const newData = await setLocation(zipCode);
//                 dataSet = newData;
//                 return true;
//             }
//         } catch ( e ) {
//             throw e;
//         }
//     }

//     function mimicUser () {
//         wildCardScrapeType = Constants.QUANTITY_TYPE;
//         EventsManager.notifyEvent(Constants.SCRAPE_QUANTITIES, {
//             "isFresh": true
//         });
//     }

//     function scrapeNextFilter ( options ) {
//         return new Promise(async ( resolve, reject ) => {
//             let nextQ;
//             for ( let i = 0; i < options.length; i++ ) {
//                 if ( options[i]["scraped"] === false ) {
//                     nextQ = options[i];
//                     break;
//                 }
//             }
//             if ( nextQ ) {
//                 const qaVal = nextQ["qa"];
//                 // const ele = await browserPage.$$('button[data-qa="' + qaVal + '"]');
//                 await browserPage.click('button[data-qa="' + qaVal + '"]');
//                 nextQ["scraped"] = true;
//                 await browserPage.click('button[data-qa="price_sorter"]');
//                 resolve(options);
//             } else {
//                 resolve(true);
//             }
//         });
//     }

//     function scrapeLabels () {
//         let options = [];

//         async function scrapeData ( type, data ) {
//             let brandSettingParEle = await browserPage.evaluateHandle(() =>
//                 document.querySelector('#uat-dropdown-container-brand div')
//             );
//             const classVal = await browserPage.evaluate('document.querySelector("#uat-dropdown-container-brand").getAttribute("class")');
//             const isLabelDisabled = classVal.indexOf("btn_disabled") >= 0;

//             if ( isLabelDisabled ) {
//                 EventsManager.notifyEvent(Constants.SCRAPE_LABELS_COMPLETED);
//             } else {
//                 if ( checkStat(type, data, options) ) {
//                     options = [];
//                     brandSettingParEle.click();
//                     setTimeout(async () => {
//                         const els = await browserPage.$$('#uat-dropdown-container-brand~div ul li');
//                         for (let i = 0; i < els.length; i++) {
//                             const qaVal = await els[i].$eval('button', i => i.getAttribute('data-qa'));
//                             let iTag = await els[i].$eval('button', i => i.getAttribute('aria-selected'));
                            
//                             options.push({
//                                 "qa": qaVal,
//                                 "scraped": iTag == "true" ? true : false
//                             });
//                         }
//                         // console.log("options", options);
//                         scrapeNextFilter(options).then(( resp ) => {
//                             // console.log("scrapeNextFilter resp 1", resp);
//                             if ( resp === true ) {
//                                 EventsManager.notifyEvent(Constants.SCRAPE_LABELS_COMPLETED);
//                             } else {
//                                 options = resp;
//                             }
//                         });
//                     }, 1000);
//                 } else {
//                     // console.log("continue usecase");
//                     brandSettingParEle = await browserPage.evaluateHandle(() =>
//                         document.querySelector('#uat-dropdown-container-brand div')
//                     );
//                     brandSettingParEle.click();
//                     scrapeNextFilter(options).then(( resp ) => {
//                         // console.log("scrapeNextFilter resp 2", resp);
//                         if ( resp === true ) {
//                             EventsManager.notifyEvent(Constants.SCRAPE_LABELS_COMPLETED);
//                         } else {
//                             options = resp;
//                         }
//                     });
//                 }
//             }
//         }

//         EventsManager.subscribeToEvent(Constants.SCRAPE_FORMS_COMPLETED, ( data ) => {
//             wildCardScrapeType = Constants.LABEL_TYPE;
//             scrapeData("return", data);
//         });

//         EventsManager.subscribeToEvent(Constants.SCRAPE_LABELS, ( data ) => {
//             // console.log("SCRAPE_LABELS data", data);
//             scrapeData("continue", data);
//         });
//     }

//     scrapeLabels();

//     function scrapeForms () {
//         let options = [];

//         async function scrapeData ( type, data ) {
//             let formSettingParEle = await browserPage.evaluateHandle(() =>
//                 document.querySelector('#uat-dropdown-container-form div')
//             );
//             const classVal = await browserPage.evaluate('document.querySelector("#uat-dropdown-container-form").getAttribute("class")');
//             const isFormDisabled = classVal.indexOf("btn_disabled") >= 0;

//             if ( isFormDisabled ) {
//                 EventsManager.notifyEvent(Constants.SCRAPE_FORMS_COMPLETED);
//             } else {
//                 if ( checkStat( type, data, options ) ) {
//                     options = [];
//                     formSettingParEle.click();
//                     setTimeout(async () => {
//                         const els = await browserPage.$$('#uat-dropdown-container-form~div ul li');
//                         for (let i = 0; i < els.length; i++) {
//                             const qaVal = await els[i].$eval('button', i => i.getAttribute('data-qa'));
//                             let iTag = await els[i].$eval('button', i => i.getAttribute('aria-selected'));
                            
//                             options.push({
//                                 "qa": qaVal,
//                                 "scraped": iTag == "true" ? true : false
//                             });
//                         }
//                         // console.log("options", options);
//                         scrapeNextFilter(options).then(( resp ) => {
//                             // console.log("scrapeNextFilter resp 1", resp);
//                             if ( resp === true ) {
//                                 EventsManager.notifyEvent(Constants.SCRAPE_FORMS_COMPLETED);
//                             } else {
//                                 options = resp;
//                             }
//                         });
//                     }, 1000);
//                 } else {
//                     // console.log("continue usecase");
//                     formSettingParEle = await browserPage.evaluateHandle(() =>
//                         document.querySelector('#uat-dropdown-container-form div')
//                     );
//                     formSettingParEle.click();
//                     setTimeout(() => {
//                         scrapeNextFilter(options).then(( resp ) => {
//                             // console.log("scrapeNextFilter resp 2", resp);
//                             if ( resp === true ) {
//                                 EventsManager.notifyEvent(Constants.SCRAPE_FORMS_COMPLETED);
//                             } else {
//                                 options = resp;
//                             }
//                         });
//                     }, 2000);
//                 }
//             }
//         }

//         EventsManager.subscribeToEvent(Constants.SCRAPE_DOSAGES_COMPLETED, ( data ) => {
//             wildCardScrapeType = Constants.FORM_TYPE;
//             scrapeData("return", data);
//         });
//         EventsManager.subscribeToEvent(Constants.SCRAPE_FORMS, ( data ) => {
//             // console.log("SCRAPE_FORMS data", data);
//             scrapeData("continue", data);
//         });
//     }

//     scrapeForms();

//     function scrapeDosage () {
//         let options = [];

//         async function scrapeData ( type, data ) {

//             let dosageSettingParEle = await browserPage.evaluateHandle(() =>
//                 document.querySelector('#uat-dropdown-container-dosage div')
//             );
//             const classVal = await browserPage.evaluate('document.querySelector("#uat-dropdown-container-dosage").getAttribute("class")');
//             const isDosageDisabled = classVal.indexOf("btn_disabled") >= 0;
//             if ( isDosageDisabled ) {
//                 EventsManager.notifyEvent(Constants.SCRAPE_DOSAGES_COMPLETED);
//             } else {
//                 if ( checkStat(type, data, options) ) {
//                     options = [];
//                     dosageSettingParEle.click();
//                     setTimeout(async () => {
//                         const els = await browserPage.$$('#uat-dropdown-container-dosage~div ul li');
//                         for (let i = 0; i < els.length; i++) {
//                             const qaVal = await els[i].$eval('button', i => i.getAttribute('data-qa'));
//                             let iTag = await els[i].$eval('button', i => i.getAttribute('aria-selected'));
                            
//                             options.push({
//                                 "qa": qaVal,
//                                 "scraped": iTag == "true" ? true : false
//                             });
//                         }
//                         // console.log("options", options);
//                         scrapeNextFilter(options).then(( resp ) => {
//                             // console.log("scrapeNextFilter resp 1", resp);
//                             if ( resp === true ) {
//                                 EventsManager.notifyEvent(Constants.SCRAPE_DOSAGES_COMPLETED);
//                             } else {
//                                 options = resp;
//                             }
//                         });
//                     }, 1000);
//                 } else {
//                     // console.log("continue usecase");
//                     dosageSettingParEle = await browserPage.evaluateHandle(() =>
//                         document.querySelector('#uat-dropdown-container-dosage div')
//                     );
//                     dosageSettingParEle.click();
//                     setTimeout(() => {
//                         scrapeNextFilter(options).then(( resp ) => {
//                             // console.log("scrapeNextFilter resp 2", resp);
//                             if ( resp === true ) {
//                                 EventsManager.notifyEvent(Constants.SCRAPE_DOSAGES_COMPLETED);
//                             } else {
//                                 options = resp;
//                             }
//                         });
//                     }, 2000);
//                 }
//             }
//         }

//         EventsManager.subscribeToEvent(Constants.SCRAPE_QUANTITIE_COMPLETED, ( data ) => {
//             // console.log("SCRAPE_QUANTITIE_COMPLETED data", data);
//             wildCardScrapeType = Constants.DOSAGE_TYPE;
//             scrapeData("return", data);
//         });
//         EventsManager.subscribeToEvent(Constants.SCRAPE_DOSAGES, ( data ) => {
//             // console.log("SCRAPE_DOSAGES data", data);
//             scrapeData("continue", data);
//         });
//     }

//     scrapeDosage();

//     function scrapeQuantity () {
//         let options = [];
//         EventsManager.subscribeToEvent(Constants.SCRAPE_QUANTITIES, async ( data ) => {
//             // console.log("SCRAPE_QUANTITIES data", data);
//             let quantitySettingParEle = await browserPage.evaluateHandle(() =>
//                 document.querySelector('#uat-dropdown-container-quantity div')
//             );
//             const classVal = await browserPage.evaluate('document.querySelector("#uat-dropdown-container-quantity").getAttribute("class")');
//             const isQuantityDisabled = classVal.indexOf("btn_disabled") >= 0;

//             if ( isQuantityDisabled ) {
//                 EventsManager.notifyEvent(Constants.SCRAPE_QUANTITIE_COMPLETED);
//             } else {
//                 if ( data["isFresh"] ) {
//                     // console.log("fresh usecase");
//                     options = [];
//                     quantitySettingParEle.click();
//                     setTimeout(async () => {
//                         const els = await browserPage.$$('#uat-dropdown-container-quantity~div ul li');
//                         for (let i = 0; i < els.length; i++) {
//                             const qaVal = await els[i].$eval('button', i => i.getAttribute('data-qa'));
//                             let iTag = await els[i].$eval('button', i => i.getAttribute('aria-selected'));
                            
//                             options.push({
//                                 "qa": qaVal,
//                                 "scraped": iTag == "true" ? true : false
//                             });
//                         }
//                         // console.log("options", options);
//                         scrapeNextFilter(options).then(( resp ) => {
//                             // console.log("scrapeNextFilter resp 1", resp);
//                             if ( resp === true ) {
//                                 EventsManager.notifyEvent(Constants.SCRAPE_QUANTITIE_COMPLETED);
//                             } else {
//                                 options = resp;
//                             }
//                         });
//                     }, 1000);
//                 } else {
//                     // console.log("continue usecase");
//                     quantitySettingParEle = await browserPage.evaluateHandle(() =>
//                         document.querySelector('#uat-dropdown-container-quantity div')
//                     );
//                     quantitySettingParEle.click();
//                     setTimeout(() => {
//                         scrapeNextFilter(options).then(( resp ) => {
//                             // console.log("scrapeNextFilter resp 2", resp);
//                             if ( resp === true ) {
//                                 EventsManager.notifyEvent(Constants.SCRAPE_QUANTITIE_COMPLETED);
//                             } else {
//                                 options = resp;
//                             }
//                         });
//                     }, 2000);
//                 }
//             }
//         });
//     }

//     scrapeQuantity();

//     function checkStat ( type, data, options ) {
//         if ( type === "continue" ) {
//             if ( data["isFresh"] ) {
//                 return true;
//             } else {
//                 return false;
//             }
//         } else {
//             if ( options.length === 0 ) {
//                 return true;
//             } else {
//                 return false;
//             }
//         }
//     }

//     function scrapeFromResponse(data) {
//         const respData = [];
//         const priceMap = {};
//         let idpMin;
//         let idpMax;
//         if (data["non_nabp_price"]) {
//             idpMin = data["non_nabp_price"]["min_price"];
//             if (idpMin) {
//                 idpMin = idpMin.toFixed(2);
//             }
//             idpMax = data["non_nabp_price"]["max_price"];
//             if (idpMax) {
//                 idpMax = idpMax.toFixed(2);
//             }
//         }
//         if (data && data["results"] && data["results"].length > 0) {
//             const results = data["results"];
//             for (let i = 0; i < results.length; i++) {
//                 const pharmaName = results[i]["pharmacy"]["name"];
//                 let price;
//                 let type = "";
//                 const priceWithType = new Map();
//                 const prices = results[i]["prices"];
//                 for (let j = 0; j < prices.length; j++) {
//                     //Consider COUPON and CASH only
//                     if (prices[j]["type"] === "COUPON" || prices[j]["type"] === "CASH") {
//                         priceWithType.set(prices[j]["type"], prices[j]["price"]);
//                     }
//                 }
//                 //Sort and consider the lowest price
//                 const sortedPriceWithType = new Map([...priceWithType.entries()].sort((a, b) => a[1] - b[1]));
//                 if (sortedPriceWithType.size > 0) {
//                     type = sortedPriceWithType.keys().next().value;
//                     price = sortedPriceWithType.get(type).toFixed(2);
//                 }
//                 respData.push({
//                     "pharmaName": pharmaName,
//                     "price": price ? "$" + price : "",
//                     "type": type,
//                 })
//             }
//             priceMap.results = respData;
//         }
//         priceMap.idpMin = idpMin ? "$" + idpMin : "";
//         priceMap.idpMax = idpMax ? "$" + idpMax : "";
//         return priceMap;
//     }

//     function httpResp ( respData ) {
//         if ( scrapeReqType === Constants.SPECIFIC_URL ) {
//             if ( respData != null ) {
//                 EventsManager.notifyEvent(Constants.SCRAPE_FOR_ZIP_COMPLETED, {
//                     "data": respData
//                 });
//             } else {
//                 EventsManager.notifyEvent(Constants.SCRAPE_FOR_ZIP_FAILED, {
//                     "data": null
//                 });
//             }
//         } else {
//             if ( wildCardScrapeType === Constants.QUANTITY_TYPE ) {
//                 EventsManager.notifyEvent(Constants.SCRAPE_QUANTITIES, {
//                     "isFresh": false
//                 });
//             } else if ( wildCardScrapeType === Constants.DOSAGE_TYPE ) {
//                 wildCardScrapeType = Constants.QUANTITY_TYPE;
//                 EventsManager.notifyEvent(Constants.SCRAPE_QUANTITIES, {
//                     "isFresh": true
//                 });
//             } else if ( wildCardScrapeType === Constants.FORM_TYPE ) {
//                 wildCardScrapeType = Constants.DOSAGE_TYPE;
//                 EventsManager.notifyEvent(Constants.SCRAPE_DOSAGES, {
//                     "isFresh": true
//                 });
//             } else if ( wildCardScrapeType === Constants.LABEL_TYPE ) {
//                 wildCardScrapeType = Constants.FORM_TYPE;
//                 EventsManager.notifyEvent(Constants.SCRAPE_FORMS, {
//                     "isFresh": true
//                 });
//             }
//         }
//     }

//     async function onHttpFail ( request ) {
//         if ( request.url().indexOf("/location") > 0 ) {
//             EventsManager.notifyEvent(Constants.ZIP_CODE_SET_ERROR);
//         }
//     }

//     async function onHttpResponse ( request ) {
//         if ( request.url().indexOf("/prices") > 0 ) {
//             const response = await request.response();
//             // console.log("prices response recieved", response.status());
//             if ( response.status() == 200 ) {
//                 response.json().then(( responseBody ) => {
//                     // console.log("responseBody", responseBody);
//                     const respData = scrapeFromResponse(responseBody);
//                     httpResp(respData);
//                 });
//             } else {
//                 httpResp(null);
//             }
//         } else if ( request.url().indexOf("/location") > 0 ) {
//             const response = await request.response();
//             // console.log("location response recieved", response.status());
//             if ( response.status() == 200 ) {
//                 EventsManager.notifyEvent(Constants.ZIP_CODE_SET_SUCCESS);
//             } else {
//                 EventsManager.notifyEvent(Constants.ZIP_CODE_SET_ERROR);
//             }
//         } else if ( request.url().indexOf("/bundle") > 0 ) {
//             const response = await request.response();
//             // console.log("bot response recieved", response.status());
//             if ( response.status() == 200 ) {
//                 EventsManager.notifyEvent(Constants.BOT_MESSAGE_VERIFIED);
//             } else {
//                 EventsManager.notifyEvent(Constants.BOT_MESSAGE_VERIFICATION_FAILURE);
//             }
//         }
//     }

//     async function onHttpInitiated ( request ) {
//         try {
//             const headers = request.headers();
//             headers['sec-fetch-site'] = 'same-origin';
//             headers['sec-ch-ua'] = '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"';

//             if ( request.url().indexOf("/prices") > 0 ) {
//                 // console.log("priceAPIStat", priceAPIStat);
//                 // console.log("Price API is getting triggered", request.url());
//                 if ( priceAPIStat ) {
//                     await request.abort();
//                 } else {
//                     EventsManager.notifyEvent(Constants.PRICE_REQUEST_TRIGGERED);
//                     await request.continue({
//                         headers
//                     });
//                 }
//             } else {
//                 await request.continue({
//                     headers
//                 });
//             }
//         } catch ( e ) {
//             throw e;
//         }
//     }

//     function getCompString ( str ) {
//         return str.replace(/\s/g, '').trim().toLowerCase();
//     }

//     function removeSpecialChars ( str ) {
//         if ( str ) return str.replace(/\/|\-/g, "");
//     }

//     function validateFilters ( $ ) {
//         try {
//             let qVal = $('#uat-dropdown-container-quantity div span').text();
//             let dVal = $('#uat-dropdown-container-dosage div span').text();
//             let fVal = $('#uat-dropdown-container-form div span').text();
//             let bVal = $('#uat-dropdown-container-brand div span').text();

//             let brandInputCompVal;
//             let brandPageCompVal;

//             if ( !bVal ) {
//                 bVal = $('#uat-dropdown-container-brand div').text();
//                 bVal = bVal.trim();
//                 // bVal = browseMetaData["genericOrBrand"];
//                 brandInputCompVal = browseMetaData.stringVal;
//             } else {
//                 brandInputCompVal = browseMetaData.genericOrBrand;
//             }
//             brandPageCompVal = bVal;

//             actualFilters = {
//                 "quantity": qVal,
//                 "form": fVal,
//                 "dosage": dVal,
//                 "label": bVal
//             };

//             let status = false;
//             let message = "";
//             let brandMatched = true;
//             let formMatched = true;
//             let strengthMatched = true;
//             if ( currUrl.indexOf("label_override") >= 0 && removeSpecialChars(getCompString(brandPageCompVal)) !== removeSpecialChars(getCompString(brandInputCompVal)) ) {
//                 message += `No data available for brand "` + browseMetaData.genericOrBrand + `" but data is available for brand "` + bVal + `"\n`;
//                 brandMatched=false;
//             }
//             if ( brandMatched && currUrl.indexOf("form") >= 0 && getCompString(fVal) !== getCompString(browseMetaData.form) ) {
//                 message += `No data available for drug_type "` + browseMetaData.form + `" but data is available for drug_type "` + fVal + `"\n`;
//                 formMatched=false;
//             }
//             if ( brandMatched && formMatched && currUrl.indexOf("dosage") >= 0 && getCompString(dVal) !== getCompString(browseMetaData.dosage) ) {
//                 message += `No data available for strength "` + browseMetaData.dosage + `" but data is available for strength "` + dVal + `"\n`;
//                 strengthMatched=false;
//             }
//             if ( brandMatched && formMatched && strengthMatched && currUrl.indexOf("quantity") >= 0 && getCompString(qVal) !== getCompString(browseMetaData.quantity) ) {
//                 message += `No data available for quantity "` + browseMetaData.quantity + `" but data is available for quantity "` + qVal + `"`;
//             }

//             if ( message.length > 0 ) {
//                 const lastIdx = message.lastIndexOf("\n");
//                 if ( lastIdx >= 0 ) {
//                     message = message.substring(0, lastIdx).trim();
//                 }
//             }

//             if ( message.length === 0 ) {
//                 status = true;
//             }

//             return {
//                 status,
//                 message
//             };
//         } catch ( e ) {
//             return {
//                 status: false,
//                 message: "Filter validation failed"
//             };
//         }
//     }

//     function extractDataFromPage ( $ ) {
//         if ( validateFilters($) ) {
//             $('li[data-qa="price_row"]').each((idx, elem) => {
//                 const pharmaName = $(elem).find("[data-qa='store_name'] span ~ span").text();
//                 const price = $(elem).find("[data-qa='drug_price']").text();
//                 dataSet.push({
//                     pharmaName,
//                     price: "$" + price.split("$")[1]
//                 });
//             });
//             return true;
//         } else {
//             return false;
//         }
//     }

//     /*
//         @param(type) = URL OR *
//     */

//     function handleError ( errObj ) {
//         if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_EMPTY_RESPONSE) >= 0 ) {
//             return new ScrapingError(ErrorHandler.MESSAGE.INVALID_INPUT, ErrorHandler.CODE.BAD_DATA);
//         } else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_CERT_AUTHORITY_INVALID) >= 0 ) {
//             return new ScrapingError(ErrorHandler.MESSAGE.SECURE_CONNECTION_ISSUE, ErrorHandler.CODE.CONNECTION_FORBIDDEN);
//         } else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_HTTP_RESPONSE_CODE_FAILURE) >= 0 ) {
//             return new ScrapingError(ErrorHandler.MESSAGE.INVALID_INPUT, ErrorHandler.CODE.DATA_NOT_FOUND);
//         } else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_PROXY_CONNECTION_FAILED) >= 0 ) {
//             return new ScrapingError(ErrorHandler.MESSAGE.PROXY_CONNECTIVITY_ISSUE, ErrorHandler.CODE.PROXY_CONNECTION_ISSUE);
//         }else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_NO_SUPPORTED_PROXIES) >= 0 ) {
//             return new ScrapingError(ErrorHandler.MESSAGE.PROXY_CONNECTIVITY_ISSUE, ErrorHandler.CODE.PROXY_CONNECTION_ISSUE);
//         } else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_TIMED_OUT) >= 0 ) {
//             return new ScrapingError(ErrorHandler.MESSAGE.NETWORK_CONNECTIVITY_ISSUE, ErrorHandler.CODE.CONNECTION_ISSUE);
//         } else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_NETWORK_CHANGED) >= 0 ) {
//             return new ScrapingError(ErrorHandler.MESSAGE.NETWORK_CONNECTIVITY_ISSUE, ErrorHandler.CODE.CONNECTION_ISSUE);
//         } else {
//             return errObj;
//         }
//     }

//     let initStatus = false;

//     function initializeHttpListner () {
//         if ( !initStatus ) {
//             initStatus = true;
//             browserPage.on('requestfinished', onHttpResponse);
//             browserPage.on('requestfailed', onHttpFail);
//             browserPage.on('request', onHttpInitiated);

//             browserPage.on('dialog', async dialog => {
//                 console.log("Dialog came up ==================");
//                 // await dialog.dismiss()
//             });
//         }
//     }

//     function checkConnection () {
//         return new Promise(( resolve, reject ) => {
//             InternetAvailable({
//                 timeout: 4000,
//                 retries: 3,
//             }).then(() => {
//                 // console.log("Internet available");
//                 resolve();
//             }).catch(() => {
//                 // console.log("No internet");
//                 reject();
//             });
//         });
//     }

//     async function scrapeUrl ( url, type, page, metaData ) {
//         try {
//             browserPage = page;
//             browseMetaData = metaData;
//             currUrl = url;
//             scrapeReqType = type;
//             dataSet = [];
//             actualFilters = null;

//             initializeHttpListner();
//             const zipVal = metaData.zipCode;
//             await loadPage(url, zipVal);
//             return { dataSet, actualFilters };
//         } catch ( err ) {
//             const errObj = handleError(err);
//             if ( errObj && errObj.status && errObj.status === ErrorHandler.CODE.PROXY_CONNECTION_ISSUE) {
//                 throw errObj;
//             } else if ( errObj && errObj.status && errObj.status === ErrorHandler.CODE.CONNECTION_ISSUE ) {
//                 checkConnection().then(() => {
//                     scrapeUrl(url, type, page, zipCode, metaData).then(( resp ) => {
//                         return resp;
//                     }).catch(( err ) => {
//                         throw err;
//                     });
//                 }).catch(() => {
//                     throw errObj;
//                 });
//             } else {
//                 throw errObj;
//             }
//         }
//     }

//     return {
//         scrapeUrl
//     };
// })();

// module.exports = DataScraper;



// async checkIfDefaultDataIsAvailable () {
//     try {
//         const locContnr = await this.page.$("[data-qa='location_container']");
//         const priceRow = await this.page.$("[data-qa='price_row']");

//         if ( locContnr == null && priceRow == null ) {
//             throw new ScrapingError(ErrorHandler.MESSAGE.NO_DATA_AVAILABLE, ErrorHandler.CODE.NO_DATA);
//         } else {
//             return true;
//         }
//     } catch ( e ) {
//         throw e;
//     }
// }
