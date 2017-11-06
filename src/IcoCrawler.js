const IcoCrawlerBulkFetcher = require('./IcoCrawlerBulkFetcher');
const IcoCrawlerFetcher = require('./IcoCrawlerFetcher');
const IcoCrawlerRunInitializer = require('./IcoCrawlerRunInitializer');
const IcoCrawlerRunStreamInitializer = require('./IcoCrawlerRunStreamInitializer');

const icoCrawlerSettings = require('./IcoCrawlerSettings');

(function () {
    let icoCrawlerBulkFetcher = 
        new IcoCrawlerBulkFetcher(icoCrawlerSettings)
            .addOnInit((options) => {

                let runInitializer = new IcoCrawlerRunInitializer()
                    .initializeNextRun({
                        pagesToIndex: options.pages,

                        onNextRunInitialized: (opts) => {
                            let streamInitializer = new IcoCrawlerRunStreamInitializer();

                            streamInitializer.deletePreviousRunStreams({
                                onSuccess: () => {

                                    streamInitializer.createNewRunStreams({
                                        runId: opts.runId,
    
                                        onSuccess: () => {
                                            if (options.onInitSuccess) {
                                                options.onInitSuccess();
                                            }
                                        }
                                    });

                                }
                            });   
                        }
                    });  
            })

            .addOnFetchIcoPage((options) => {
                console.log('Page ' + options.pageIndex + ' content was fetched.')
            })

            .addOnFetchIco(() => {
                let icoCrawlerFetcher = new IcoCrawlerFetcher()
                    .addOnIcoFetched(() => {

                    })
                    .fetch();
            })

            .fetch();
})();