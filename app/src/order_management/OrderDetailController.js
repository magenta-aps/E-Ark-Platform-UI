angular.module('eArkPlatform.ordermanagement').controller('OrderDetailController', OrderDetailController);

/**
 * Main controller for the order management module
 */
function OrderDetailController($stateParams, ordermanagementService) {
    var odCtrl = this;
    odCtrl.orderId = $stateParams.orderid;
    odCtrl.data = [];
    odCtrl.archivists = [
        'none',
        'Mogens',
        'Peter',
        'Jette',
        'Xin'
    ];

    ordermanagementService.getOrder(odCtrl.orderId).then(function(response) {
        odCtrl.data = response;
    });
      
};