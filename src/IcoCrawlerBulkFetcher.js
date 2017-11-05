const request = require('request');

const IcoCrawlerBulkFetcherExtractor = 
    require('./IcoCrawlerBulkFetcherExtractor');

const IcoCrawlerBulkFetcherRequester = 
    require('./IcoCrawlerBulkFetcherRequester');

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
                let pageHtml = IcoCrawlerBulkFetcherExtractor
                    .extractHtml({
                        html: body
                    });

                let numberOfPages = IcoCrawlerBulkFetcherExtractor
                    .extractNumberOfIcoPages({
                        html: pageHtml,
                    });

                if (this.onInit) {
                    this.onInit({
                        pages: numberOfPages
                    });
                }

                if (this.onFetchIcoPage) {
                    this.onFetchIcoPage({
                        pageHtml: pageHtml
                    });
                }

                if (numberOfPages > 0) {
                    IcoCrawlerBulkFetcherRequester.performRequests({
                        numberOfPages: numberOfPages,
                        pageUrlPattern: this.settings.pageUrl,

                        onPageFetch: (options) => {
                            if (this.onFetchIcoPage) {
                                this.onFetchIcoPage({
                                    pageHtml: pageHtml
                                });
                            }
                        },

                        onSuccess: () => {
                            console.log('All pages were fetched.')
                        },

                        onFailure: (options) => {
                            console.log('Error occured: ' + options.error);
                        }
                    });
                }

                console.log('Number of pages to index: ' + numberOfPages);
            });

        return this;
    }
}

module.exports = IcoCrawlerBulkFetcher;