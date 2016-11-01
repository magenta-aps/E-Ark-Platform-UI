angular.module('eArkPlatform.ordermanagement').controller('OrderDetailController', OrderDetailController);

/**
 * Main controller for the order management module
 */
function OrderDetailController($stateParams, ordermanagementService, $mdDialog, $mdToast, errorService, $translate) {
    var odCtrl = this;
    odCtrl.orderId = $stateParams.orderid;
    odCtrl.data = [];
    odCtrl.archivists = [];
    odCtrl.assigneeSelector = 'none';
    odCtrl.fileInfoDiag = fileInfoDiag;
    odCtrl.executeOrder = executeOrder;
    odCtrl.refreshOrderDetails = refreshOrderDetails;
    
    odCtrl.refreshOrderDetails(odCtrl.orderId);
    
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
    
    function refreshOrderDetails( oid ) {
        ordermanagementService.getOrder( oid ).then(function(response) {
            odCtrl.data = response;
            if ( odCtrl.data.assignee !== 'none' ) {
                odCtrl.assigneeSelector = odCtrl.data.assignee.userName;
            };
        });
    }
    
    function executeOrder( oid ) {
        var order = { orderId: oid };
        console.log('Processing order')
        ordermanagementService.processOrder(order).then(function (response) {
            if (response) {
                console.log('That went well.');
                $mdToast.showSimple( $translate.instant('ORDERMAN.MSG.PROCESS_SUBMIT_SUCCESS') )
            } else {
                errorService.displayErrorMsg( $translate.instant('ORDERMAN.MSG.PROCESS_SUBMIT_ERROR') );
            };        
        });
    }
    
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