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

        firehose.createDeliveryStream(icoPageStreamParams, (error, data) => {
            if (error) {
                console.log(error);
                
                return;
            }

            firehose.createDeliveryStream(icoStreamParams, (error, data) => {
                if (error) {
                    console.log(error);

                    return;
                }

                if (options.onSuccess) {
                    options.onSuccess();
                }
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