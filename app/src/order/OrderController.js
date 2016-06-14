angular.module('eArkPlatform.order').controller('OrderController', OrderController);

/**
 * Main controller for the order module
 * @param searchService
 * @param fileUtilsService
 * @param basketService
 * @constructor
 */
function OrderController(searchService, fileUtilsService, basketService, sessionService, $state) {
    
    var ordCtrl = this;
    ordCtrl.searchTerm = '';
    ordCtrl.searchContext = 'content';
    ordCtrl.searchResults = basketService.currentSearch;
    ordCtrl.basket = [];

    ordCtrl.executeSearch = executeSearch;
    ordCtrl.addToBasket = basketCheck;

    function executeSearch() {
        ordCtrl.searchResults = {};
        var queryObj = {
            q: ordCtrl.searchContext + ':' + ordCtrl.searchTerm,
            rows: 25,
            start: 0,
            wt: "json"
        };
        var encTerm = searchService.objectToQueryString(queryObj);

        searchService.aipSearch(encTerm).then(function (response) {
            if (response.numFound > 0) {
                basketService.currentSearch = {
                    documents: response.docs, //An array of objects
                    numberFound: response.numFound
                };
                
                //Let's clean up some of the properties. Temporary solution
                basketService.currentSearch.documents.forEach(function (item) {
                    item.title = item.path.substring(item.path.lastIndexOf('/') + 1, item.path.lastIndexOf('.'));
                    item.packageId = item.package.substring(item.package.indexOf('_') + 1);
                    item.thumbnail = fileUtilsService.getFileIconByMimetype(item.contentType, 24)
                    item.displaySize = formatBytes(item.size);
                });
                ordCtrl.searchResults = basketService.currentSearch;
            };
        });
    };

    function basketCheck(item) {
        if (item.baskOp === 'add') {
            basketService.addToBasket(item);
        };
        if (item.baskOp === 'delete') {
            basketService.removeFromBasket(item).then(function (result) {
                console.log('Removal status: ' + result);
            });
        };
    };

    function formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

};
