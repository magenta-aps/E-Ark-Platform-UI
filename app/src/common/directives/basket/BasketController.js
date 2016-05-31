angular
    .module('eArkPlatform.common.directives.basket')
    .directive('basketDirective', basketDirective);

/**
 * Main Controller for the Basket module
 * @param $scope
 * @constructor
 */
function basketDirective(basketService) {
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

        };

        scope.removeItem = function(item){
            basketService.remove(removeFromBasket(item, basket).then(function(response){
                if(response){
                    idx = basketService.findItemInBasket(item, scope.itemsList);
                    scope.itemsList[idx].baskOps = 'delete';
                }
            }) )
        };

        scope.submitOrder = scope.submitMethod;


        function _showBasketDialog(ev, userInfo) {
            $mdDialog.show({
                controller: 'UserDialogController',
                controllerAs: 'ucd',
                locals: {
                    user: userInfo
                },
                templateUrl: 'app/src/users/view/userCrudDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function onUpdateOrCreate(user) {
                vm.allSystemUsers = [];
                getAllSystemUsers();
            });
        }

    }

}