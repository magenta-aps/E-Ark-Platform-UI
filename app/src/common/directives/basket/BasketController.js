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
        templateUrl : 'app/src/common/directives/basket/view/basketDialogBtn.html',
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
        scope.openBasketDialog = function(){
            _showBasketDialog();
        };

        function _showBasketDialog(ev ) {
            $mdDialog.show({
                controller: BasketDialogController,
                controllerAs: 'bdc',
                locals: {
                    basket: scope.basket,
                    itemsList: scope.itemsList,
                    submitMethod: scope.submitMethod
                },
                templateUrl: 'app/src/common/directives/basket/view/basketDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }

        function BasketDialogController($scope, $mdDialog, basket, itemsList, basketService){
            var bdc = this;
            var order;

            $scope.basket = basket;
            $scope.submitMethod = function(form){
                order = angular.copy(form);
                if (scope.preProcess)
                    scope.preProcessFunction({orderData:order});
                $mdDialog.hide().then(function(){
                    basketService.submitOrder(order).then(function(response) {
                        if(response){
                            //clean everything if successful
                            scope.itemsList = [];
                            scope.basket =[];
                        }
                    });
                });

            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.removeItem = function(item){
                basketService.removeFromBasket(item, basket).then(function(response){
                    if(response){
                        var idx = basketService.findItemInBasket(item, itemsList);
                        scope.itemsList[idx].baskOp = 'delete';
                    }
                });
            };
        }

    }

}