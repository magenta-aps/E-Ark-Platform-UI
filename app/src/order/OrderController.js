angular.module('eArkPlatform.order').controller('OrderController', OrderController);

/**
 * Main controller for the order module
 * @param searchService
 * @param fileUtilsService
 * @param basketService
 * @constructor
 */
function OrderController($scope, searchService, fileUtilsService, basketService, sessionService, orderService, $state, $mdDialog, $translate) {
    
    var ordCtrl = this;
    ordCtrl.searchStr = '';
    ordCtrl.initialTerm = '';
    ordCtrl.searchInputs = [];
    ordCtrl.searchResults = basketService.currentSearch;
    ordCtrl.basket = [];
    ordCtrl.basketLength = basketService.basket.length;
    ordCtrl.orderHistory = [];
    ordCtrl.orderBy = '-orderStatus';
    ordCtrl.filterBy = { title: '', packageId: '' };
    ordCtrl.state = $state;
    
    ordCtrl.sortThis = sortThis;
    ordCtrl.executeSearch = executeSearch;
    ordCtrl.addToBasket = basketCheck;
    ordCtrl.goToOrder = goToOrder;
    ordCtrl.addInput = addInput;
    ordCtrl.removeInput = removeInput;
    ordCtrl.helpfulSearchHints = helpfulSearchHints;
    ordCtrl.fileInfoDiag = fileInfoDiag;
    ordCtrl.updateList = updateList;

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
    }
    function goToOrder (orderId) {
        $state.go('orderDetail', {orderId: orderId});
    }

    function executeSearch() {
        ordCtrl.searchStr = 'content: ' + ordCtrl.initialTerm;
        
        for (var i in ordCtrl.searchInputs) {
            if (ordCtrl.searchInputs[i].term !== '') {
                ordCtrl.searchStr = ordCtrl.searchStr + ' ' + ordCtrl.searchInputs[i].operator + ' content: ' + ordCtrl.searchInputs[i].term + '';
            }
        }
        ordCtrl.searchResults = {};
        var queryObj = {
            q: ordCtrl.searchStr + ' AND path:*/representations/*/data/* AND NOT path:*_mig-*',
            rows: 25,
            start: 0,
            fl: 'package,stream_size,path,confidential,content_type,textCategory,_version_,title,packageId,author,' +
            'eadid_s,eadtitle_s,eaddate_s,eaddatestructuredfrom_dt,eaddatestructuredto_dt,eaddatestructuredfrom_dt,' +
            'eaddatestructuredto_dt,eadorigination_s,eadabstract_t,eadaccessrestrict_s,eadclevel_s', //fields
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
        ordCtrl.basketLength = basketService.basket.length;
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
        cleanedItem.size = item.stream_size;
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
    
    function addInput() {
        var inputObj = { term: '', operator: 'OR' };
        ordCtrl.searchInputs.push( inputObj );
    }
    
    function removeInput(inputObj) {
        var i = ordCtrl.searchInputs.indexOf(inputObj);
        ordCtrl.searchInputs.splice(i, 1);
    }
    
    function helpfulSearchHints(ev) {
        $mdDialog.show(
          $mdDialog.alert()
            //.parent(angular.element(document.querySelector('#adv-search-help')))
            .clickOutsideToClose(true)
            .title( $translate.instant( 'ORDER.SEARCH.ADV_SEARCH_HELP' ) )
            .textContent( $translate.instant( 'ORDER.SEARCH.ADV_SEARCH_TXT' ) )
            .ariaLabel( $translate.instant( 'ORDER.SEARCH.ADV_SEARCH_HELP' ) )
            .ok( $translate.instant( 'COMMON.UNDERSTOOD' ) )
            .targetEvent(ev)
        );
    }
    
    function fileInfoDiag(ev, doc) {
        $mdDialog.show({
          controller: fileInfoDialogController,
          templateUrl: 'app/src/order/view/fileInfoDiag.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: { document: doc },
          clickOutsideToClose: true,
          fullscreen: true
        });
    }
    function fileInfoDialogController($scope, $mdDialog, document) {
        var fidc = this;
        
        $scope.doc = document;
        
        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    }
    function updateList() {
        orderService.getAllOrdersStatus().then(
            function(response) {
                if (!response) {
                    console.log('somehting went wrong');
                } else {
                    console.log('We have status updates');
                    ordermanagementService.getOrders().then(function(response) {
                        olCtrl.data = response.orders;
                    });
                }
            },
            function(response) {
                console.log('No statuses were updated');
            }
        );
    }

}