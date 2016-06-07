angular.module('eArkPlatform.ordermanagement').controller('OrderDetailController', OrderDetailController);

/**
 * Main controller for the order management module
 */
function OrderDetailController($stateParams) {
    var odCtrl = this;
    
    // Get the order ID (to call ajax for data: 'GET /getOrderData?orderId=' + $stateParams.orderid )
    odCtrl.orderId = $stateParams.orderid;
    
    odCtrl.data = {
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
      
};