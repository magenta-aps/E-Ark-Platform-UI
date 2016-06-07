angular.module('eArkPlatform.ordermanagement').controller('OrdersListController', OrdersListController);

/**
 * Main controller for the order management module
 */
function OrdersListController() {
    var olCtrl = this;

    olCtrl.data = [
        {
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
            "orderId": 123
		},
        {
            "title": "Another order title",
            "origin": null,
            "endUserOrderNote": "yadda yadda yadda",
            "orderDate": "2014-02-23 09:00:00",
            "plannedDate": "2017-10-01 11:00:00",
            "user": {
                "uid": "uid1",
                "firstname": "Mogens",
                "lastname": "Glistup",
                "email": "mg@bornholm.dk"
            },
            "orderId": 456
		}
    ];
    
}