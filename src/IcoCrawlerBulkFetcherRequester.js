const request = require('request');
const format = require('string-format');

class IcoCrawlerBulkFetcherRequester {
    static performRequests(options) {
        let pagesToIndex = options.numberOfPages;

        let onRequest = (onRequestOptions) => {
            let pageUrl = format(options.pageUrlPattern, 
                onRequestOptions.pagesToIndex);

            IcoCrawlerBulkFetcherRequester.performRequest({
                url: pageUrl,

                onSuccess: (opts) => {
                    if (options.onPageFetch) {
                        options.onPageFetch({
                            rawHtml: opts.rawHtml
                        });
                    }

                    if (onRequestOptions.pagesToIndex > 0) {
                        onRequest({
                            pagesToIndex: onRequestOptions.pagesToIndex - 1
                        });

                    } else if (onRequestOptions.pagesToIndex === 0) {

                        if (options.onSuccess) {
                            options.onSuccess();
                        }

                    }
                },

                onFailure: (opts) => {
                    if (onRequestOptions.onFailure) {
                        onRequestOptions.onFailure({
                            error: opts.error
                        });
                    }
                }
            });
        };
        
        onRequest({
            pagesToIndex: pagesToIndex
        });
    }

    static performRequest(options) {
        request(
            options.url, { json: true },

            (error, response, body) => {
                if (error) {
                    console.log('Cannot fetch content');
                    
                    if (options.onFailure) {
                        options.onFailure({
                            error: error
                        });
                    }
                }

                if (options.onSuccess) {
                    options.onSuccess({
                        rawHtml: body
                    });
                }
            });
    }
}

module.exports = IcoCrawlerBulkFetcherRequester;