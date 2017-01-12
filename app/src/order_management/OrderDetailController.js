angular.module('eArkPlatform.ordermanagement').controller('OrderDetailController', OrderDetailController);

/**
 * Main controller for the order management module
 */
function OrderDetailController($stateParams, $mdDialog, $mdToast,  $translate, errorService, ordermanagementService, sessionService) {
    var odCtrl = this;
    odCtrl.orderId = $stateParams.orderid;
    odCtrl.data = [];
    odCtrl.archivists = [];
    odCtrl.assigneeSelector = 'none';
    odCtrl.fileInfoDiag = fileInfoDiag;
    odCtrl.executeOrder = executeOrder;
    odCtrl.packageOrder = packageOrder;
    odCtrl.refreshOrderDetails = refreshOrderDetails;
    odCtrl.browsable = false;
    odCtrl.unProcessed = false;
    odCtrl.statusEnum = {
        error: 0,
        new : 1,
        open : 2,
        submitted : 3,
        processing : 4,
        ready : 5
    };
    
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
        var userData = sessionService.getUserInfo().user;
        ordermanagementService.getOrder( oid ).then(function(response) {
            odCtrl.data = response;
            console.log("User is: "+ userData.role);
            if ( odCtrl.data.assignee !== 'none' ) {
                odCtrl.assigneeSelector = odCtrl.data.assignee.userName;
            }
            odCtrl.unProcessed = (odCtrl.data.orderStatus == 'new');
            odCtrl.browsable = (odCtrl.data.orderStatus == 'ready' ||
                               (userData.role =='archivist' && odCtrl.statusEnum[odCtrl.data.orderStatus] > 3) )
        });
    }
    
    function executeOrder( oid ) {
        var order = { orderId: oid };
        console.log('Processing order');
        ordermanagementService.processOrder(order).then(function (response) {
            if (response) {
                console.log('That went well.');
                odCtrl.refreshOrderDetails(odCtrl.orderId);
                $mdToast.showSimple( $translate.instant('ORDERMAN.MSG.PROCESS_SUBMIT_SUCCESS') )
            } else {
                errorService.displayErrorMsg( $translate.instant('ORDERMAN.MSG.PROCESS_SUBMIT_ERROR') );
            }
        });
    }

    function packageOrder(oid) {
        console.log('Packaging order: '+ oid);
        ordermanagementService.packageOrder(oid).then(function (response) {
            if (response) {
                odCtrl.refreshOrderDetails(odCtrl.orderId);
                $mdToast.showSimple($translate.instant('ORDERMAN.MSG.PROCESS_SUBMIT_SUCCESS'))
            } else {
                errorService.displayErrorMsg($translate.instant('ORDERMAN.MSG.PROCESS_SUBMIT_ERROR'));
            }
        })
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
    }
    
    function fileInfoDialogController($scope, $mdDialog, document) {
        var fidc = this;
        
        $scope.doc = document;
        
        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    }
    
}