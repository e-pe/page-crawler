const AWS = require('aws-sdk');
const AWSConfig = require('../config/AWSConfig');

class IcoCrawlerRunStreamInitializer {
    constructor() {
        AWS.config.update({
            region: AWSConfig.Firehorse.region
        });
    }

    createNewRunStreams(options) {
        let firehose = new AWS.Firehose({
            apiVersion: AWSConfig.Firehorse.apiVersion
        });

        let icoPageStreamParams = {
            DeliveryStreamName: 'icolounge-crawler-ico-page-stream-' + options.runId,
            DeliveryStreamType: 'DirectPut',

            S3DestinationConfiguration: {
                BucketARN: 'arn:aws:s3:::icolounge-crawler-data',
                RoleARN: 'arn:aws:iam::462882701258:role/icolounge-crawler-ingestion-role',
                Prefix: options.runId + '/pages/'
            }
        };

        let icoStreamParams = {
            DeliveryStreamName: 'icolounge-crawler-ico-stream-' + options.runId,
            DeliveryStreamType: 'DirectPut',

            S3DestinationConfiguration: {
                BucketARN: 'arn:aws:s3:::icolounge-crawler-data',
                RoleARN: 'arn:aws:iam::462882701258:role/icolounge-crawler-ingestion-role',
                Prefix: options.runId + '/page/'
            }
        };

        firehose.createDeliveryStream(icoStreamParams, (error, data) => {
            if (error) {
                console.log(error);

                return;
            }

            firehose.createDeliveryStream(icoPageStreamParams, (error, data) => {
                if (error) {
                    console.log(error);
                    
                    return;
                }

                let onCanFinish = () => {
                    let params = {
                        DeliveryStreamName: icoPageStreamParams.DeliveryStreamName
                    };

                    firehose.describeDeliveryStream(params, function(err, data) {
                        if (error) {
                            console.log(error);
                        }
                        
                        let streamStatus = data.DeliveryStreamDescription
                            .DeliveryStreamStatus;
        
                        if (streamStatus === 'CREATING') {
                            setTimeout(() => {
                                onCanFinish();
                            }, 60000);
                        } else if (streamStatus === 'ACTIVE') {
                            if (options.onSuccess) {
                                options.onSuccess();
                            }
                        }
                    });
                };

                onCanFinish();
            });
        });

        return this;
    }

    deletePreviousRunStreams(options) {
        let firehose = new AWS.Firehose({
            apiVersion: AWSConfig.Firehorse.apiVersion
        });

        let onDeleteDeliveryStream = (opts) => {
            let deleteStreamParams = {
                DeliveryStreamName: opts.deliveryStreamName
            };

            let onDeleteStream = () => {
                firehose.deleteDeliveryStream(deleteStreamParams, (error, data) => {
                    if (error) {
                        console.log(error);
    
                        return;
                    }
    
                    console.log('Delivery stream -' + opts.deliveryStreamName + ' - was deleted.');
    
                    if (opts.onSuccess) {
                        opts.onSuccess();
                    }
                });
            }; 

            let onCanDeleteStream = () => {
                let params = {
                    DeliveryStreamName: opts.deliveryStreamName
                };
    
                firehose.describeDeliveryStream(params, function(error, data) {
                    let streamStatus = data.DeliveryStreamDescription
                        .DeliveryStreamStatus;
    
                    if (streamStatus === 'CREATING') {
                        setTimeout(() => {
                            onCanDeleteStream();
                        }, 60000);
                    } else if (streamStatus === 'ACTIVE') {
                        onDeleteStream();
                    }
                });
            };
            
            onCanDeleteStream();
        };

        let listStreamParams = {
            DeliveryStreamType: 'DirectPut'
        };

        firehose.listDeliveryStreams(listStreamParams, (error, data) => {
            let deliveryStreamNames = data.DeliveryStreamNames;

            let onDeleteStream = (streamIndex) => {
                if (streamIndex > 0) {
                    onDeleteDeliveryStream({
                        deliveryStreamName: deliveryStreamNames[streamIndex - 1],

                        onSuccess: () => {
                            onDeleteStream(streamIndex - 1);
                        }
                    });
                    
                } else if (streamIndex === 0) {
                    if (options.onSuccess) {
                        options.onSuccess();
                    }
                }
            };

            onDeleteStream(deliveryStreamNames.length);
        });

        return this;
    }
}

module.exports = IcoCrawlerRunStreamInitializer;