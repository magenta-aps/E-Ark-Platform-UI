angular.module('eArkPlatform.ordermanagement').controller('OrdersListController', OrdersListController);

/**
 * Main controller for the order management module
 */
function OrdersListController(ordermanagementService) {
    var olCtrl = this;
    olCtrl.data = [];

    ordermanagementService.getOrders().then(function(response) {
        olCtrl.data = response.orders;
    });
    
}