angular.module('eArkPlatform.ordermanagement').controller('OrderDetailController', OrderDetailController);

/**
 * Main controller for the order management module
 */
function OrderDetailController($stateParams, ordermanagementService, $mdDialog) {
    var odCtrl = this;
    odCtrl.orderId = $stateParams.orderid;
    odCtrl.data = [];
    odCtrl.archivists = [];
    odCtrl.assigneeSelector = 'none';
    odCtrl.fileInfoDiag = fileInfoDiag;
    
    ordermanagementService.getOrder(odCtrl.orderId).then(function(response) {
        odCtrl.data = response;
        if ( odCtrl.data.assignee !== 'none' ) {
            odCtrl.assigneeSelector = odCtrl.data.assignee.userName;
        };
    });
    
    ordermanagementService.getArchivists().then(function(response) {
        odCtrl.archivists = response.archivists;
    });

    odCtrl.updateOrderStatus = function() { 
        var queryObj = {};
        queryObj.orderId = odCtrl.data.orderId;
        queryObj.orderStatus = odCtrl.data.orderStatus;
        ordermanagementService.updateOrder(queryObj).then(function(response) {
            console.log('order updated');
        });
    };
    
    odCtrl.updateOrderAssignee = function() { 
        var queryObj = {};
        queryObj.orderId = odCtrl.data.orderId;
        queryObj.assignee = odCtrl.assigneeSelector;
        ordermanagementService.updateOrder(queryObj).then(function(response) {
            console.log('order updated');
        });
    };
    
    function fileInfoDiag(ev, doc) {
        $mdDialog.show({
          controller: fileInfoDialogController,
          templateUrl: 'app/src/order/view/fileInfoDiag.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: { document: doc },
          clickOutsideToClose: true,
          fullscreen: true
        });
    };
    
    function fileInfoDialogController($scope, $mdDialog, document) {
        var fidc = this;
        
        $scope.doc = document;
        
        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    };
    
};