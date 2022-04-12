const ErrorHandler = require("./error-handler");
const { ScrapingError } = require("./ErrorTypes");

class Utility {
    
    constructor () {

    }

    getCompString ( str ) {
        if ( str ) return str.replace(/\s/g, '').trim().toLowerCase();
    }

    removeSpecialChars ( str ) {
        if ( str ) return str.replace(/\/|\-/g, "");
    }

    getError ( errObj ) {
        if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_EMPTY_RESPONSE) >= 0 ) {
            return new ScrapingError(ErrorHandler.MESSAGE.INVALID_INPUT, ErrorHandler.CODE.BAD_DATA);
        } else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_CERT_AUTHORITY_INVALID) >= 0 ) {
            return new ScrapingError(ErrorHandler.MESSAGE.SECURE_CONNECTION_ISSUE, ErrorHandler.CODE.CONNECTION_FORBIDDEN);
        } else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_HTTP_RESPONSE_CODE_FAILURE) >= 0 ) {
            return new ScrapingError(ErrorHandler.MESSAGE.INVALID_INPUT, ErrorHandler.CODE.DATA_NOT_FOUND);
        } else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_PROXY_CONNECTION_FAILED) >= 0 ) {
            return new ScrapingError(ErrorHandler.MESSAGE.PROXY_CONNECTIVITY_ISSUE, ErrorHandler.CODE.PROXY_CONNECTION_ISSUE);
        }else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_NO_SUPPORTED_PROXIES) >= 0 ) {
            return new ScrapingError(ErrorHandler.MESSAGE.PROXY_CONNECTIVITY_ISSUE, ErrorHandler.CODE.PROXY_CONNECTION_ISSUE);
        } else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_TIMED_OUT) >= 0 ) {
            return new ScrapingError(ErrorHandler.MESSAGE.NETWORK_CONNECTIVITY_ISSUE, ErrorHandler.CODE.CONNECTION_ISSUE);
        } else if ( errObj.message.indexOf(ErrorHandler.SERVER_MESSAGE.ERR_NETWORK_CHANGED) >= 0 ) {
            return new ScrapingError(ErrorHandler.MESSAGE.NETWORK_CONNECTIVITY_ISSUE, ErrorHandler.CODE.CONNECTION_ISSUE);
        } else {
            return errObj;
        }
    }

    getDataFromServerResponse ( data ) {
        const respData = [];
        const priceMap = {};
        let idpMin;
        let idpMax;
        if (data["non_nabp_price"]) {
            idpMin = data["non_nabp_price"]["min_price"];
            if (idpMin) {
                idpMin = idpMin.toFixed(2);
            }
            idpMax = data["non_nabp_price"]["max_price"];
            if (idpMax) {
                idpMax = idpMax.toFixed(2);
            }
        }
        if (data && data["results"] && data["results"].length > 0) {
            const results = data["results"];
            for (let i = 0; i < results.length; i++) {
                const pharmaName = results[i]["pharmacy"]["name"];
                let price;
                let type = "";
                const priceWithType = new Map();
                const prices = results[i]["prices"];
                for (let j = 0; j < prices.length; j++) {
                    //Consider COUPON and CASH only
                    if (prices[j]["type"] === "COUPON" || prices[j]["type"] === "CASH") {
                        priceWithType.set(prices[j]["type"], prices[j]["price"]);
                    }
                }
                //Sort and consider the lowest price
                const sortedPriceWithType = new Map([...priceWithType.entries()].sort((a, b) => a[1] - b[1]));
                if (sortedPriceWithType.size > 0) {
                    type = sortedPriceWithType.keys().next().value;
                    price = sortedPriceWithType.get(type).toFixed(2);
                }
                respData.push({
                    "pharmaName": pharmaName,
                    "price": price ? "$" + price : "",
                    "type": type,
                })
            }
            priceMap.results = respData;
        }
        priceMap.idpMin = idpMin ? "$" + idpMin : "";
        priceMap.idpMax = idpMax ? "$" + idpMax : "";
        return priceMap;
    }
}

module.exports = new Utility();
