angular
    .module('eArkPlatform.common.directives.basket')
    .directive('orderBasket', basketDirective);

/**
 * Main Controller for the Basket module
 * @param $scope
 * @constructor
 */
function basketDirective(basketService, $mdDialog) {
    return {
        restrict:'E',
        templateUrl : 'app/src/common/directives/basket/view/basketDialogBtn.html',
        scope: {
            basket: '=',
            itemsList: '=',
            submitMethod: '&'
        },//variables to pass into the directive's scope,//variables to pass into the directive's scope
        link: link
    };

    function link(scope){
        scope.openBasketDialog = function(){
            _showBasketDialog();
        };

        function _showBasketDialog(ev ) {
            //debugger;
            $mdDialog.show({
                controller: BasketDialogController,
                controllerAs: 'bcd',
                locals: {
                    basket: scope.basket,
                    itemsList: scope.itemsList,
                    submitMethod: scope.submitMethod
                },
                templateUrl: 'app/src/common/directives/basket/view/basketDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function formPostProcessing(response) {
                //postprocessing
                console.log(response);
            });
        }

        function BasketDialogController($scope, $translate, $mdDialog, basket, itemsList, submitMethod){
            debugger;
            $scope.basket = basket;
            $scope.itemsList = itemsList;
            $scope.submitMethod = submitMethod;

            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.removeItem = function(item){
                basketService.remove(removeFromBasket(item, basket).then(function(response){
                    if(response){
                        idx = basketService.findItemInBasket(item, scope.itemsList);
                        scope.itemsList[idx].baskOps = 'delete';
                    }
                }) )
            };
        }

    }

}