const request = require('request');
const format = require('string-format');

class IcoCrawlerBulkFetcher {
    constructor(settings) {
        this.settings = settings;

        this.onFetchIco = null;
    }

    addOnFetchIcoList(onFetchIcoList) {
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
                console.log(body);
            });

        return this;
    }
}

module.exports = IcoCrawlerBulkFetcher;