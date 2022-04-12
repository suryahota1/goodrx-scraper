const Constants = require("../constants");
const ErrorHandler = require("../error-handler");
const Utility = require("../Utility");
const Scraper = require("./Scraper");

class UrlScraper extends Scraper {
    constructor ( ...props ) {
        super(...props);
        this.eventTracker.defineEvents([Constants.PRICE_REQUEST_TRIGGERED, Constants.ZIP_CODE_SET_SUCCESS,
            Constants.SCRAPE_FOR_ZIP_COMPLETED, Constants.SCRAPE_FOR_ZIP_FAILED,
            Constants.ZIP_CODE_SET_ERROR, Constants.BOT_MESSAGE_VERIFIED, Constants.ALL_REQUESTS_DONE
        ]);
    }

    async scrapeData () {
        try {
            const dataStat = await this.loadPage();
            Logger.log("UrlScraper scrapeData dataStat", dataStat);
            if ( !dataStat ) {
                const filterVal = this.getFiltersSelectedInPage();
                let actualFilters = {
                    "quantity": filterVal.qVal,
                    "form": filterVal.fVal,
                    "dosage": filterVal.dVal,
                    "label": filterVal.bVal
                };
                return {
                    dataSet: [],
                    actualFilters: actualFilters,
                    status: "na"
                }
            } else {
                const data = await this.retrieveData();
                if ( !data["dataSet"] || data["dataSet"].length === 0 ) {
                    data["status"] = "noData";
                }
                return data;
            }
        } catch ( err ) {
            Logger.log("UrlScraper scrapeData err", err);
            const errObj = Utility.getError(err);
            if ( errObj && errObj.status && errObj.status === ErrorHandler.CODE.PROXY_CONNECTION_ISSUE) {
                throw errObj;
            } else if ( errObj && errObj.status && errObj.status === ErrorHandler.CODE.CONNECTION_ISSUE ) {
                this.checkConnection().then(async () => {
                    try {
                        await this.scrapeData();
                        return resp;
                    } catch ( e ) {
                        throw err;
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

module.exports = UrlScraper;
