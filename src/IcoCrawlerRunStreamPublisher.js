const AWS = require('aws-sdk');
const AWSConfig = require('../config/AWSConfig');

class IcoCrawlerRunStreamPublisher {
    constructor(runId) {
        this.runId = runId;

        this.icoStreamName = 
            'icolounge-crawler-ico-stream-' + this.runId;
        
        this.icoPageStreamName = 
            'icolounge-crawler-ico-page-stream-' + this.runId;

        AWS.config.update({
            region: AWSConfig.Firehorse.region
        });
    }

    publishDataToIcoPageStream(options) {
        let firehose = new AWS.Firehose({
            apiVersion: AWSConfig.Firehorse.apiVersion
        });

        let params = {
            DeliveryStreamName: this.icoPageStreamName,
            Record: {
                Data: new Buffer(options.data)
            }
        };

        firehose.putRecord(params, function(error, data) {
            if (error) {
                console.log("Could not put the record" + error);
            }
        });
    }

    publishDataToIcoStream(options) {
        let firehose = new AWS.Firehose({
            apiVersion: AWSConfig.Firehorse.apiVersion
        });

        let params = {
            DeliveryStreamName: this.icoStreamName,
            Record: {
                Data: new Buffer(options.pageHtml)
            }
        };

        firehose.putRecord(params, function(error, data) {
            if (error) {
                console.log("Could not put the record" + error);
            }
        });
    }
}

module.exports = IcoCrawlerRunStreamPublisher;