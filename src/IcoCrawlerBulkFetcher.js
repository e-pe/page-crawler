const request = require('request');
const format = require('string-format');

const IcoCrawlerBulkFetcherExtractor = 
    require('./IcoCrawlerBulkFetcherExtractor');

class IcoCrawlerBulkFetcher {
    constructor(settings) {
        this.settings = settings;

        this.onFetchIco = null;
    }

    addOnFetchIcoList(onFetchIcoList) {
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

                console.log('Number of pages to index: ' + numberOfPages);
            });

        return this;
    }
}

module.exports = IcoCrawlerBulkFetcher;