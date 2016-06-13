angular
    .module('eArkPlatform.common.directives.basket')
    .directive('orderBasket', basketDirective);

/**
 * Main Controller for the Basket module
 * @param $scope
 * @constructor
 */
function basketDirective($mdDialog, basketService) {
    return {
        restrict:'E',
        templateUrl : 'app/src/common/directives/basket/view/basket.html',
        scope: {
            basket: '=', //The basket containing the items ordered
            itemsList: '=', //The actual list of items that is chosen from. (we pass this so that we may deselect from
            // the list if the otem is removed from the basket()
            preProcess: '@', //boolean that says whether or not we want to preprocess before submitting
            preProcessFunction: '&' //Function to call for preprocessing
        },
        link: link
    };

    function link(scope){
        
        function BasketController($scope, basket, itemsList, basketService){
            var bdc = this;
            var order;

            $scope.basket = basket;
            
            $scope.submitMethod = function(form){
                order = angular.copy(form);
                if (scope.preProcess) {
                    scope.preProcessFunction({orderData:order});
                };
                basketService.submitOrder(order).then(function(response) {
                    if(response){
                        //clean everything if successful
                        scope.itemsList = [];
                        scope.basket =[];
                    }
                });
            };
            
            $scope.removeItem = function(item){
                basketService.removeFromBasket(item, basket).then(function(response){
                    if(response){
                        var idx = basketService.findItemInBasket(item, itemsList);
                        scope.itemsList[idx].baskOp = 'delete';
                    }
                });
            };
            
        };
        
    };

}