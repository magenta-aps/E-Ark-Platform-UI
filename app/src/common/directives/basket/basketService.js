angular
    .module('eArkPlatform.common.directives.basket')
    .service('basketService', basketService);

function basketService($q, $http, OMS_URI, $filter) {
    
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
        };
    };

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
    };

    function findItemInBasket(item) {
        return bService.basket.findIndex(function (bItem) {
            if (item.path === bItem.path) {
                return true;
            };
        });
    };

    function submitOrder(order){
        console.log("Order received. It looks like this:");
        console.log($filter('json')(order));
        debugger;
        $http.post( OMS_URI.serviceProxy + '/newOrder', $filter('json')(order) ).then(function(response){
            debugger;
            console.log("The response from posting a new order:", response);
        });
    };
    
};

/* POST newOrder JSON must look like this
{
	"order": {
		"title": "Example order title",
		"origin": null,
		"endUserOrderNote": "Please provide this order as fast as possible",
		"orderDate": "2016-05-18 12:00:00",
		"plannedDate": "2016-05-18 12:00:00",
		"user": {
			"uid": "uid1",
			"firstname": "Clint",
			"lastname": "Eastwood",
			"email": "clint@hollywood.com"		
		},
		"items": [
					{
						"title": "Item1",
						"aipURI": "http://xyz.org/path",
						"aipTitle": "This is the AIP title",
						"levelOfDescription": 123
					},
					{
						"title": "Item2",
						"aipURI": "http://xyz.org/path2",
						"aipTitle": "This is the AIP title 2",
						"levelOfDescription": 1234
					}
				]
	}
}
*/
