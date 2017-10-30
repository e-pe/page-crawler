const request = require('request');
const format = require('string-format');

const IcoCrawlerBulkFetcherExtractor = 
    require('./IcoCrawlerBulkFetcherExtractor');

class IcoCrawlerBulkFetcher {
    constructor(settings) {
        this.settings = settings;

        this.onFetchIco = null;
        this.onFetchIcoPage = null;
        this.onInit = null;
    }

    addOnInit(onInit) {
        this.onInit = onInit;

        return this;
    }

    addOnFetchIcoPage(onFetchIcoPage) {
        this.onFetchIcoPage = onFetchIcoPage;

        return this;
    }

    addOnFetchIco(onFetchIco) {
        this.onFetchIco = onFetchIco;

        return this;
    }

    fetch() {
        request(
            this.settings.url, 
            { json: true }, 
            (error, response, body) => {
                let numberOfPages = IcoCrawlerBulkFetcherExtractor
                    .extractNumberOfIcoPages({
                        html: body,
                    });

                if (this.onInit) {
                    this.onInit({
                        pages: numberOfPages
                    });
                }

                console.log('Number of pages to index: ' + numberOfPages);
            });

        return this;
    }
}

module.exports = IcoCrawlerBulkFetcher;