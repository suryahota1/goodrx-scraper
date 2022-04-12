const Constants = require("./constants");
const Util = require('./Utility');

class HttpTracker {

    #page;
    #eventTracker;
    #priceAPIStat;
    #reqList;

    constructor ( page, eventTracker ) {
        this.#page = page;
        this.#eventTracker = eventTracker;
        this.#priceAPIStat = false;
        this.#reqList = [];
    }

    setEventTracker ( eventTracker ) {
        this.#eventTracker = eventTracker;
    }

    getPendingRequests () {
        return this.#reqList;
    }

    async #httpResp ( respData ) {
        if ( respData != null ) {
            this.#eventTracker.notifyEvent(Constants.SCRAPE_FOR_ZIP_COMPLETED, {
                "data": respData
            });
        } else {
            this.#eventTracker.notifyEvent(Constants.SCRAPE_FOR_ZIP_FAILED, {
                "data": null
            });
        }
    }

    async #onHttpResponse ( request ) {
        const idx = this.#reqList.indexOf(request.url());
        if ( idx >= 0 ) {
            this.#reqList.splice(idx, 1);
        }

        if ( request.url().indexOf("/prices") > 0 ) {
            const response = await request.response();
            if ( response.status() == 200 ) {
                response.json().then(( responseBody ) => {
                    const respData = Util.getDataFromServerResponse(responseBody);
                    Logger.log("onHttpResponse respData", respData);
                    this.#httpResp(respData);
                });
            } else {
                this.#eventTracker.notifyEvent(Constants.SCRAPE_FOR_ZIP_FAILED);
            }
        } else if ( request.url().indexOf("/location") > 0 ) {
            const response = await request.response();
            if ( response.status() == 200 ) {
                this.#eventTracker.notifyEvent(Constants.ZIP_CODE_SET_SUCCESS);
            } else {
                this.#eventTracker.notifyEvent(Constants.ZIP_CODE_SET_ERROR);
            }
        } else if ( request.url().indexOf("/bundle") > 0 ) {
            const response = await request.response();
            if ( response.status() == 200 ) {
                this.#eventTracker.notifyEvent(Constants.BOT_MESSAGE_VERIFIED);
            } else {
                this.#eventTracker.notifyEvent(Constants.BOT_MESSAGE_VERIFICATION_FAILURE);
            }
        }
    }

    async #onHttpFail ( request ) {
        if ( request.url().indexOf("/location") > 0 ) {
            const idx = this.#reqList.indexOf(request.url());
            if ( idx >= 0 ) {
                this.#reqList.splice(idx, 1);
            }
            this.#eventTracker.notifyEvent(Constants.ZIP_CODE_SET_ERROR);
        }
    }

    async #onHttpInitiated ( request ) {
        try {
            const headers = request.headers();
            headers['sec-fetch-site'] = 'same-origin';
            headers['sec-ch-ua'] = '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"';

            if ( request.url().indexOf("/prices") > 0 ) {
                if ( this.#priceAPIStat ) {
                    await request.abort();
                } else {
                    this.#eventTracker.notifyEvent(Constants.PRICE_REQUEST_TRIGGERED);
                    await request.continue({
                        headers
                    });
                    this.#reqList.push(request.url());
                }
            } else {
                await request.continue({
                    headers
                });
                this.#reqList.push(request.url());
            }
        } catch ( e ) {
            Logger.error("onHttpInitiated e", e);
            // throw e;
        }
    }

    initializeHttpListners () {
        this.#page.on('requestfinished', this.#onHttpResponse.bind(this));
        this.#page.on('requestfailed', this.#onHttpFail.bind(this));
        this.#page.on('request', this.#onHttpInitiated.bind(this));
    }

    removeHttpListners () {
        Logger.log("to remove listners");
        this.#page.off('requestfinished', this.#onHttpResponse.bind(this));
        this.#page.off('requestfailed', this.#onHttpFail.bind(this));
        this.#page.off('request', this.#onHttpInitiated.bind(this));
    }
}

module.exports = HttpTracker;
