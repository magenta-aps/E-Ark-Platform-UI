angular
    .module('eArkPlatform.common.directives.basket')
    .service('basketService', basketService);

function basketService($q, $http, $filter, $mdToast, $translate) {
    
    var bService = this;
    bService.basket = [];
    bService.currentSearch = {};
    
    bService.addToBasket = addToBasket;
    bService.findItemInBasket = findItemInBasket;
    bService.removeFromBasket = removeFromBasket;
    bService.submitOrder = submitOrder;


    /**
     * Adds the item. Unless it exists then removes it instead
     * @param item
     */
    function addToBasket(item) {
        if (bService.findItemInBasket(item) == -1) {
            bService.basket.push(item);
        }
    }
    function removeFromBasket(item) {
        var defer = $q.defer();
        try {
            var bIndex = bService.findItemInBasket(item);
            bService.basket.splice(bIndex, 1);
            defer.resolve(true);
        }
        catch (err) {
            defer.reject('unable to remove ' + item.title + ' from basket because: ' + err.message);
        }
        return defer.promise;
    }

    function findItemInBasket(item) {
        return bService.basket.findIndex(function (bItem) {
            if (item.path === bItem.path) {
                return true;
            }
        });
    }

    function submitOrder(order){
        return $http.post('/api/newOrder', $filter('json')(order)).then(function(response){
            console.log("Order received. It looks like this:");
            console.log(response);
            $mdToast.show(
                $mdToast.simple()
                    .textContent($translate.instant('BASKET.YOUR_ORDER_IS_RECEIVED'))
                    .position('top right')
                    .hideDelay(4000)
            );
            return response;
        })
    }
    
}
