angular
    .module('eArkPlatform.common.directives.basket')
    .controller('BasketController', BasketController)
    .directive('orderBasket', basketDirective);


/**
 * Main Controller for the Basket module
 * @param $scope
 * @constructor
 */

function BasketController($scope, basketService, sessionService){

    var bdc = this;
    var order;

    bdc.basket = basketService.basket;
    
    $scope.removeItem = function(item) {
        basketService.removeFromBasket(item).then(function(response){
            if (response) { // Updating current search list
                basketService.currentSearch.documents.findIndex(function (bItem, bIndex) {
                    if (item.path === bItem.path) {
                        basketService.currentSearch.documents[bIndex].baskOp = 'delete';
                    };
                });
            };
        });
    };
    
    $scope.compileOrder = function(orderData) {
        var userInfo = sessionService.getUserInfo();
        orderData.origin = "WEB";
        orderData.orderStatus = "New";
        orderData.orderDate = new Date().toISOString();
        orderData.plannedDate = orderData.plannedDate.toISOString();
        orderData.user = {
            uid: userInfo.user.userName,
            firstname: userInfo.user.firstName,
            lastname: userInfo.user.lastName,
            email: userInfo.user.email
        };
        orderData.items = [];
        for (var doc in basketService.basket) {
            var orderItem = {
                title: basketService.basket[doc].title
                /* Missing these properties. They are not available from object.                
				aipURI: "http://xyz.org/path2",
				aipTitle: "This is the AIP title 2",
				levelOfDescription: 1234
                */
            };
            orderData.items.push(orderItem);
        };
        return orderData;
    };
    
    $scope.submitMethod = function(formData){
        // Preprocssing order before POSTing
        var formDataCopy = angular.copy(formData);
        var finalOrder = { order: $scope.compileOrder(formDataCopy) };
        
        basketService.submitOrder(finalOrder).then(function(response) {
            if(response){
                //clean everything if successful
                basketService.currentSearch = {};
                basketService.basket = [];
            };
        });
    };
    
};


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
