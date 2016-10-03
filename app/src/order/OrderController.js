angular.module('eArkPlatform.order').controller('OrderController', OrderController);

/**
 * Main controller for the order module
 * @param searchService
 * @param fileUtilsService
 * @param basketService
 * @constructor
 */
function OrderController(searchService, fileUtilsService, basketService, sessionService, orderService, $state) {
    
    var ordCtrl = this;
    ordCtrl.searchTerm = '';
    ordCtrl.searchContext = 'content';
    ordCtrl.searchResults = basketService.currentSearch;
    ordCtrl.basket = [];
    ordCtrl.orderHistory = [];
    ordCtrl.orderBy = '-orderStatus';
    ordCtrl.filterBy = {
        title: '',
        packageId: ''
    };
    ordCtrl.state = $state;
    
    ordCtrl.sortThis = sortThis;
    ordCtrl.executeSearch = executeSearch;
    ordCtrl.addToBasket = basketCheck;
    ordCtrl.goToOrder = goToOrder;

    var user = sessionService.getUserInfo().user;
    
    function getUserOrderHistory(){
        orderService.getUserOrderHistory(user.userName).then(function(response){
            if(response.orders.length > 0){

                ordCtrl.orderHistory = response.orders;
            }
        })

    }

    getUserOrderHistory();
    
    function sortThis( $event, sortParameter ) {
        if (ordCtrl.orderBy === sortParameter) {
            ordCtrl.orderBy = '-' + sortParameter;
        } else if (ordCtrl.orderBy === '-' + sortParameter) {
            ordCtrl.orderBy = '';
        } else {
            ordCtrl.orderBy = sortParameter;
        }
    };

    function goToOrder (orderId) {
        $state.go('orderDetail', {orderId: orderId});
    }

    function executeSearch() {
        ordCtrl.searchResults = {};
        var queryObj = {
            q: ordCtrl.searchContext + ':' + ordCtrl.searchTerm+' AND path:*/representations/*/data/* AND NOT path:*_mig-*',
            rows: 25,
            start: 0,
            filter: 'package,size,path,confidential,content_type,textCategory', //fields
            sort :'package asc',
            wt: 'json'
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
                    if(item.package)
                        item.packageId = item.package.substring(item.package.lastIndexOf(':') + 1);
                    item.thumbnail = fileUtilsService.getFileIconByMimetype(item.contentType, 24);
                    item.displaySize = formatBytes(item.stream_size);
                });
                ordCtrl.searchResults = basketService.currentSearch;
            }
        });
    }

    function basketCheck(item) {
        if (item.baskOp === 'add') {
            basketService.addToBasket(item);
        }
        if (item.baskOp === 'delete') {
            basketService.removeFromBasket(item).then(function (result) {
                console.log('Removal status: ' + result);
            });
        }
    }

    function compileOrder(orderData) {
        var userInfo = sessionService.getUserInfo();
        var packagedOrder = groupByPackage(ordCtrl.basket);
        orderData.origin = "WEB";
        orderData.orderDate = new Date().toISOString();
        orderData.plannedDate = orderData.plannedDate.toISOString();
        orderData.user = {
            userName: userInfo.user.userName,
            firstname: userInfo.user.firstname,
            lastname: userInfo.user.lastname,
            email: userInfo.user.email
        };
        orderData.items = packagedOrder;
        return orderData;
    }

    /**
     * Organises each item by the package they belong to
     * @param basket
     * @returns {Array}
     */
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
     * Takes the content and returns only the necessary data that we need for each ordered item
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