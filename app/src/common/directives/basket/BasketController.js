angular
    .module('eArkPlatform.common.directives.basket')
    .controller('BasketController', BasketController)
    .directive('orderBasket', basketDirective);


/**
 * Main Controller for the Basket module
 * @param $scope
 * @constructor
 */

function BasketController($scope, basketService){
    var bdc = this;
    var order;
    bdc.basket = basketService.basket;
    
    console.log('item list from dir: ' + $scope.itemsList);
    console.log('Basket: ' + bdc.basket);
    
    $scope.submitMethod = function(form){
        order = angular.copy(form);
        if (scope.preProcess) {
            scope.preProcessFunction({orderData:order});
        };
        basketService.submitOrder(order).then(function(response) {
            if(response){
                //clean everything if successful
                $scope.itemsList = [];
                basketService.basket =[];
            }
        });
    };
    
    $scope.removeItem = function(item){
        basketService.removeFromBasket(item).then(function(response){
            if(response){
                var idx = basketService.findItemInBasket(item, $scope.itemsList);
                $scope.itemsList[idx].baskOp = 'delete';
            }
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
            itemsList: '=', //The actual list of items that is chosen from. (we pass this so that we may deselect from
            // the list if the otem is removed from the basket()
            preProcess: '@', //boolean that says whether or not we want to preprocess before submitting
            preProcessFunction: '&' //Function to call for preprocessing
        }
    };
};
