angular.module('eArkPlatform.order').controller('MyOrderDetailController', OrderDetailController);

/**
 * Main controller for the order management module
 */
function OrderDetailController($stateParams, orderService, fileUtilsService) {
    var oddCtrl = this;
    oddCtrl.orderId = $stateParams.orderId;
    oddCtrl.data = [];
    oddCtrl.assigneeSelector = 'none';

    orderService.getOrderDetail(oddCtrl.orderId).then(function (response) {
        response.items.forEach(function (item) {
            item.thumbnail = fileUtilsService.getFileIconByMimetype(item.contentType, 24)
            item.displaySize = fileUtilsService.getFileSize(item.size);
        });

        oddCtrl.data = response;
    });

}