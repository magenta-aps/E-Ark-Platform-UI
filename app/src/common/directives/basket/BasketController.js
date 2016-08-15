angular
    .module('eArkPlatform.common.directives.basket')
    .controller('BasketController', BasketController)
    .directive('orderBasket', basketDirective);


/**
 * Main Controller for the Basket module
 * @param $scope
 * @constructor
 */

function BasketController($scope, $state, basketService, sessionService){

    var bdc = this;
    var order;

    bdc.basket = basketService.basket;
    
    $scope.removeItem = function(item) {
        basketService.removeFromBasket(item).then(function(response){
            if (response) { // Updating current search list
                basketService.currentSearch.documents.findIndex(function (bItem, bIndex) {
                    if (item.path === bItem.path) {
                        basketService.currentSearch.documents[bIndex].baskOp = 'delete';
                    }
                });
            }
        });
    };
    
    $scope.compileOrder = function(orderData) {
        var userInfo = sessionService.getUserInfo();
        var packagedOrder = groupByPackage(basketService.basket);
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
    };

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
    };
    
    $scope.submitMethod = function(formData){
        // Preprocssing order before POSTing
        var formDataCopy = angular.copy(formData);
        var finalOrder = { order: $scope.compileOrder(formDataCopy) };
        
        basketService.submitOrder(finalOrder).then(function(response) {
            if(response){
                //clean everything if successful
                basketService.currentSearch = {};
                basketService.basket =  bdc.basket = [];
                $state.go('orderBrowse');
            }
        });
    };
    
}


/*
 * Basket directive
 */

function basketDirective(basketService) {
    return {
        restrict:'E',
        templateUrl : 'app/src/common/directives/basket/view/basket.html',
        scope: {}
    };
};
