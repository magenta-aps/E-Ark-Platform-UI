angular
    .module('eArkPlatform.common.directives.basket')
    .service('basketService', basketService);

function basketService($q, $http, OMS_URI) {
    var bService = this;
    bService.addToBasket = addToBasket;
    bService.findItemInBasket = findItemInBasket;
    bService.removeFromBasket = removeFromBasket;
    bService.submitOrder = submitOrder;


    /**
     * Adds the item. Unless it exists then removes it instead
     * @param item
     */
    function addToBasket(item, basket) {
        if (findItemInBasket(item, basket) == -1)
            basket.push(item);
    }

    function removeFromBasket(item, basket) {
            var defer = $q.defer();
            try {
                var bIndex = findItemInBasket(item, basket);
                basket.splice(bIndex, 1);
                defer.resolve(true);
            }
            catch (err) {
                defer.reject('unable to remove ' + item.title + ' from basket because: ' + err.message);
            }
            return defer.promise;
    }

    function findItemInBasket(item, basket) {
        return basket.findIndex(function (bItem) {
            if (item.path == bItem.path)
                return true;
        });
    }

    function submitOrder(order, url){
        console.log("Order received: " + order);
        debugger;
        return $http.post(OMS_URI.serviceProxy +'/newOrder',{order:order})
    }
}