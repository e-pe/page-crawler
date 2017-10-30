const AWS = require('aws-sdk');

class IcoCrawlerRunInitializer {
    initializeNextRun(options) {
        this.fetchLastRun({
            onFetchRun: () => {
                this.createNewRun({
                    pagesToIndex: options.pagesToIndex,
                    
                    onCreateRun: () => {

                    }
                })
            }
        });
    }

    fetchLastRun(options) {

    }

    createNewRun(options) {
        let document = new AWS.DynamoDB.DocumentClient();
    }
}

module.exports = IcoCrawlerRunInitializer;