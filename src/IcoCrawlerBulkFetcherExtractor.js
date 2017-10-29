const cheerio = require('cheerio');
const sanitizeHtml = require('sanitize-html');

class IcoCrawlerBulkFetcherExtractor {
    static extractNumberOfIcoPages(options) {
        let firstPageHtml = sanitizeHtml(options.html, {
            allowedAttributes: {
                '*': [ 'class' ]
            }
        });
        
        let firstPageSelector = cheerio.load(firstPageHtml);
        let numberOfPages = 
            firstPageSelector('.ico_list > .pages > .num')
                .last()
                .text();

        return numberOfPages;
    }
}

module.exports = IcoCrawlerBulkFetcherExtractor;