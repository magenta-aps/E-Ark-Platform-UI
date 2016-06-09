angular.module('eArkPlatform.ordermanagement').controller('OrderDetailController', OrderDetailController);

/**
 * Main controller for the order management module
 */
function OrderDetailController($stateParams, ordermanagementService) {
    var odCtrl = this;
    odCtrl.orderId = $stateParams.orderid;
    odCtrl.data = [];
    odCtrl.archivists = [];

    odCtrl.updateOrder = function(params) {
        var queryObj = {};
        queryObj.orderId = odCtrl.data.orderId;
        for (var param in params) {
            queryObj[params[param]] = odCtrl.data[params[param]];
        };
        console.log(queryObj)
        ordermanagementService.updateOrder(queryObj).then(function(response) {
            console.log('order updated');
        });
    };
    
    ordermanagementService.getOrder(odCtrl.orderId).then(function(response) {
        odCtrl.data = response;
    });
    
    ordermanagementService.getArchivists().then(function(response) {
        odCtrl.archivists = response.archivists;
    });
};