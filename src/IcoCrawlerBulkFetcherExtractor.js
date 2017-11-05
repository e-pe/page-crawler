const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');

class IcoCrawlerBulkFetcherExtractor {
    static extractHtml(options) {
        let pageHtml = sanitizeHtml(options.html, {
            allowedAttributes: {
                '*': [ 'class' ]
            }
        });

        return pageHtml;
    }

    static extractNumberOfIcoPages(options) {
        let firstPageSelector = cheerio.load(options.html);
        let numberOfPages = 
            firstPageSelector('.ico_list > .pages > .num')
                .last()
                .text();

        return numberOfPages !== '' ? parseInt(numberOfPages) : 0;
    }
}

module.exports = IcoCrawlerBulkFetcherExtractor;