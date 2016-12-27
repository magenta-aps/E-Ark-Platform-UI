angular.module('eArkPlatform.ordermanagement').controller('OrdersListController', OrdersListController);


/**
 * Main controller for the order management module
 */

function OrdersListController($state, ordermanagementService) {
    var olCtrl = this;
    olCtrl.data = [];
    olCtrl.orderBy = '-orderStatus';
    
    ordermanagementService.getOrders().then(function(response) {
        olCtrl.data = response.orders;
    });
    
    olCtrl.sortThis = function($event, sortParameter) {
        if (olCtrl.orderBy === sortParameter) {
            olCtrl.orderBy = '-' + sortParameter;
        } else if (olCtrl.orderBy === '-' + sortParameter) {
            olCtrl.orderBy = '';
        } else {
            olCtrl.orderBy = sortParameter;
        }
    };
    
    olCtrl.orderDetailGo = function(orderId) {
        $state.go('orderManageDetail', {orderid: orderId});
    };
    
    olCtrl.updateList = function() {
        ordermanagementService.getAllOrdersStatus().then(
            function(response) {
                if (!response) {
                    console.log('somehting went wrong');
                } else {
                    console.log('We have status updates');
                    ordermanagementService.getOrders().then(function(response) {
                        olCtrl.data = response.orders;
                    });
                }
            },
            function(response) {
                console.log('No statuses were updated');
            }
        );
    }
    
}