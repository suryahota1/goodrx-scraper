const Scraper = require("./Scraper");

class DefaultScraper extends Scraper {
    constructor ( ...props ) {

    }

    async scrapeData () {
        try {
            const dataStat = await this.loadPage();
            if ( !dataStat ) {
                return {
                    dataSet: [],
                    actualFilters: null
                }
            } else {
                return await this.retrieveData();
            }
        } catch ( e ) {

        }
    }
}

module.exports = DefaultScraper;
