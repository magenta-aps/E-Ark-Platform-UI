angular
    .module('openDeskApp.common.directives.basket')
    .directive('BasketDirective', BasketDirective);

/**
 * Main Controller for the Basket module
 * @param $scope
 * @constructor
 */
function BasketDirective($scope, $q) {
    return {
        restrict:'E',
        replace: true,
        templateUrl : 'app/src/common/directives/basket/view/basket.html',
        scope: {},//variables to pass into the directive's scope
        link: link
    };

    function link (scope){
        scope.items=[];
    }

    function addToBasket(item) {
        basket.items.push(item);
    }

    function removeFromBasket(item) {
        return function () {
            var defer = $q.defer();
            try {
                bindex = basket.items.findIndex(function (bItem) {
                    if (item.path == bItem.path)
                        return true;
                });
                debugger;
                basket.items.splice(bindex, 1);
                defer.resolve(true);
            }
            catch (err) {
                defer.reject('unable to remove ' + item.title + ' from basket because: ' + err.message);
            }

            return defer.promise;
        }
    }

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

}