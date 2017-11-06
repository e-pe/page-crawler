const AWS = require('aws-sdk');
const AWSConfig = require('../config/AWSConfig');

class IcoCrawlerRunInitializer {
    constructor() {
        AWS.config.update({
            region: AWSConfig.DynamoDB.region
        });
    }

    initializeNextRun(initializeNextRunOptions) {
        this.fetchLastRun({
            onFetchRun: (fetchRunOptions) => {
                let nextRunId = fetchRunOptions.lastRunId + 1;

                this.createNewRun({
                    runId: nextRunId,
                    pagesToIndex: initializeNextRunOptions.pagesToIndex,

                    onCreateRun: () => {
                        if (initializeNextRunOptions.onNextRunInitialized) {
                            initializeNextRunOptions.onNextRunInitialized({
                                runId: nextRunId
                            });
                        }
                    }
                });
            }
        });
    }

    fetchLastRun(options) {
        let dynamoDb = new AWS.DynamoDB.DocumentClient({ 
            apiVersion: AWSConfig.DynamoDB.apiVersion 
        });

        let params = {
            TableName: 'icolounge-crawler-runs',
            KeyConditionExpression : 'RunName = :RunName',
            ExpressionAttributeValues : {
                ':RunName' : 'icolounge-index-run'        
            },
            ScanIndexForward: false
        };

        dynamoDb.query(params, (error, data) => {
            if (!error) {
                console.log('Last run was found.');

                let lastRunId = data.Items.length > 0 ? 
                    data.Items[0].RunId : -1;

                if (options.onFetchRun) {
                    options.onFetchRun({
                        lastRunId: lastRunId
                    });
                }
            }
        });
    }

    createNewRun(options) {
        let dynamoDb = new AWS.DynamoDB.DocumentClient({ 
            apiVersion: AWSConfig.DynamoDB.apiVersion
        });

        let runParams = {
            TableName: 'icolounge-crawler-runs',
            Item: {
                RunId: options.runId,
                RunName: 'icolounge-index-run',
                PageCount: options.pagesToIndex,
                Timestamp: (new Date()).toISOString()
            }
        };

        dynamoDb.put(runParams, (error, data) => {
            if (!error) {
                console.log("New run was successfully initialized.");

                if (options.onCreateRun) {
                    options.onCreateRun();
                }
            }
        });
    }
}

module.exports = IcoCrawlerRunInitializer;