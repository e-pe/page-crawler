const IcoCrawlerBulkFetcher = require('./IcoCrawlerBulkFetcher');
const IcoCrawlerFetcher = require('./IcoCrawlerFetcher');
const IcoCrawlerRunInitializer = require('./IcoCrawlerRunInitializer');

const icoCrawlerSettings = require('./IcoCrawlerSettings');

(function () {
    let icoCrawlerBulkFetcher = 
        new IcoCrawlerBulkFetcher(icoCrawlerSettings)
            .addOnInit((options) => {
                let runInitializer = new IcoCrawlerRunInitializer()
                    .initializeNextRun({
                        pagesToIndex: options.pages
                    });
            })

            .addOnFetchIcoPage(() => {

            })

            .addOnFetchIco(() => {
                let icoCrawlerFetcher = new IcoCrawlerFetcher()
                    .addOnIcoFetched(() => {

                    })
                    .fetch();
            })

            .fetch();
})();