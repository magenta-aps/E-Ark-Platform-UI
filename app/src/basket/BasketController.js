angular
    .module('angularStubApp.basket')
    .controller('BasketController', BasketController);

/**
 * Main Controller for the Basket module
 * @param $scope
 * @constructor
 */
function BasketController(basketService) {
    var basket = this;

    basket.items = [];

    function groupByPackage() {
        var tmp = [];
        basket.items.forEach(function (item) {
            if (tmp.length < 1)
                tmp.push({
                    packageId: item.packageId,
                    items: [item]
                });
            else {
                var pIndex = tmp.findIndex(function (pack) {
                    return pack.packageId == item.packageId;
                });
                if (pIndex != -1) {
                    tmp[pIndex].items.push(item);
                }
                else {
                    tmp.push({
                        packageId: item.packageId,
                        items: [item]
                    });
                }
            }
        });
        return tmp;
    }

    function basketDialog() {
        return $mdDialog.show({
            controller: BasketDialogController,
            templateUrl: 'app/src/basket/view/basketDialog.html',
            parent: angular.element(document.body),
            targetEvent: null,
            clickOutsideToClose: true,
            locals: {}
        });
    }

    function BasketDialogController($scope, $mdDialog) {
        basket.items = basketService.getItems();

        $scope.viewerTemplateUrl = templatesUrl;

        $scope.close = function () {
            $mdDialog.hide();
        };

        $scope.submit = function () {
            /*
            submitMethod().then(function(response){
                if(response.status == 200) {
                    $mdDialog.hide();
                    basket.items = [];
                }
            });
            */
        };

    }

}