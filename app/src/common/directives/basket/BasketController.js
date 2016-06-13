angular
    .module('eArkPlatform.common.directives.basket')
    .controller('BasketController', BasketController)
    .directive('orderBasket', basketDirective);


/**
 * Main Controller for the Basket module
 * @param $scope
 * @constructor
 */

function BasketController($scope, basketService, $mdDialog){
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
    
    $scope.submitMethod = function(form){
        
        order = angular.copy(form);
        /* Preprocess can't be picked up within a different scope. Either process it beforehand or create a service for it.
        if (scope.preProcess) {
            scope.preProcessFunction({orderData:order});
        };
        */
        
        $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Sending your order: ' + order.title)
                .textContent('Comments: ' + order.endUserOrderNote + '; Must be ready by: ' + plannedDate)
                .ariaLabel('Send order alert')
                .ok('Okay')
        );
        
        basketService.submitOrder(order).then(function(response) {
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
        scope: {
            preProcess: '@', //boolean that says whether or not we want to preprocess before submitting
            preProcessFunction: '&' //Function to call for preprocessing
        }
    };
};
