const IcoCrawlerBulkFetcher = require('./IcoCrawlerBulkFetcher');
const IcoCrawlerFetcher = require('./IcoCrawlerFetcher');

const icoCrawlerSettings = require('./IcoCrawlerSettings');

(function () {
    let icoCrawlerBulkFetcher = new IcoCrawlerBulkFetcher(icoCrawlerSettings)
        .addOnFetchIcoList(() => {

        })

        .addOnFetchIco(() => {
            let icoCrawlerFetcher = new IcoCrawlerFetcher()
                .addOnIcoFetched(() => {

                })
                .fetch();
        })

        .fetch();
})();