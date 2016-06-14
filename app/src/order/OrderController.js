angular.module('eArkPlatform.order').controller('OrderController', OrderController);

/**
 * Main controller for the order module
 * @param searchService
 * @param fileUtilsService
 * @param basketService
 * @constructor
 */
function OrderController(searchService, fileUtilsService, basketService, sessionService) {
    var ordCtrl = this;
    ordCtrl.searchTerm = '';
    ordCtrl.searchContext = 'content';
    ordCtrl.searchResults = {};
    ordCtrl.basket = [];
    ordCtrl.layout = 'list';

    ordCtrl.executeSearch = executeSearch;
    ordCtrl.addToBasket = basketCheck;
    ordCtrl.compileOrder = compileOrder;

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
                ordCtrl.searchResults = {
                    documents: response.docs, //An array of objects
                    numberFound: response.numFound
                };

                //Let's clean up some of the properties. Temporary solution
                ordCtrl.searchResults.documents.forEach(function (item) {
                    item.title = item.path.substring(item.path.lastIndexOf('/') + 1, item.path.lastIndexOf('.'));
                    item.packageId = item.package.substring(item.package.indexOf('_') + 1);
                    item.thumbnail = fileUtilsService.getFileIconByMimetype(item.contentType, 24)
                    item.displaySize = formatBytes(item.size);
                });
            }
        });
    }

    function basketCheck(item) {
        if (item.baskOp == 'add')
            basketService.addToBasket(item, ordCtrl.basket);
        if (item.baskOp == 'delete')
            basketService.removeFromBasket(item, ordCtrl.basket).then(function (result) {
                console.log('Removal status: ' + result);
            });
    }

    function compileOrder(orderData) {
        var userInfo = sessionService.getUserInfo();
        var packagedOrder = groupByPackage(ordCtrl.basket);
        debugger;
        orderData.origin = "WEB";
        orderData.orderDate = new Date().toISOString();
        orderData.plannedDate = orderData.plannedDate.toISOString();
        orderData.user = {
            uid: userInfo.user.userName,
            firstname: userInfo.user.firstName,
            lastname: userInfo.user.lastName,
            email: userInfo.user.email
        };
        orderData.items = packagedOrder;
    }

    function groupByPackage(basket) {
        var tmp = [];
        basket.forEach(function (item) {
            if (tmp.length < 1)
                tmp.push({
                    packageId: item.packageId,
                    items: [cleanItem(item)]
                });
            else {
                var pIndex = tmp.findIndex(function (pack) {
                    return pack.packageId == item.packageId;
                });
                if (pIndex != -1) {
                    tmp[pIndex].items.push(cleanItem(item));
                }
                else {
                    tmp.push({
                        packageId: item.packageId,
                        items: [cleanItem(item)]
                    });
                }
            }
        });
        return tmp;
    }

    /**
     * That's the content and returns only the necessary data that we need for each ordered item
     * @param item
     */
    function cleanItem(item){
        var cleanedItem = {};

        cleanedItem.title = item.title;
        cleanedItem.packageId = item.packageId;
        cleanedItem.confidential =  item.confidential;
        cleanedItem.path = item.path;
        cleanedItem.contentType = item.contentType;
        cleanedItem.size = item.size;
        return cleanedItem;
    }

    function formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

}