angular
    .module('eArkPlatform.common.directives.basket')
    .controller('BasketController', BasketController)
    .directive('orderBasket', basketDirective);


/**
 * Main Controller for the Basket module
 * @param $scope
 * @constructor
 */

function BasketController($scope, $state, basketService, sessionService, $mdDialog){

    var bdc = this;
    var order;

    bdc.basket = basketService.basket;
    bdc.fileInfoDiag = fileInfoDiag;
    
    bdc.orderForm = {
        order: {
            plannedDate: new Date(),
        }
    };
    
    $scope.removeItem = function(item) {
        basketService.removeFromBasket(item).then(function(response){
            if (response) { // Updating current search list
                basketService.currentSearch.documents.findIndex(function (bItem, bIndex) {
                    if (item.path === bItem.path) {
                        basketService.currentSearch.documents[bIndex].baskOp = 'delete';
                    }
                });
            }
        });
    };
    
    $scope.compileOrder = function(orderData) {
        var userInfo = sessionService.getUserInfo();
        var packagedOrder = groupByPackage(basketService.basket);
        orderData.origin = "WEB";
        orderData.orderDate = new Date().toISOString();
        if (orderData.plannedDate) {
            orderData.plannedDate = orderData.plannedDate.toISOString();
        }
        orderData.user = {
            userName: userInfo.user.userName,
            firstname: userInfo.user.firstname,
            lastname: userInfo.user.lastname,
            email: userInfo.user.email
        };
        orderData.items = packagedOrder;
        return orderData;
    };

    function groupByPackage(basket) {
        var tmp = [];
        basket.forEach(function (item) {
            if (tmp.length < 1)
                tmp.push({
                    packageId: item.packageId,
                    items: [cleanItem(item)]
                });
            else {
                var pIndex = tmp.findIndex(function (pack) {
                    return pack.packageId == item.packageId;
                });
                if (pIndex != -1) {
                    tmp[pIndex].items.push(cleanItem(item));
                }
                else {
                    tmp.push({
                        packageId: item.packageId,
                        items: [cleanItem(item)]
                    });
                }
            }
        });
        return tmp;
    }

    /**
     * That's the content and returns only the necessary data that we need for each ordered item
     * @param item
     */
    function cleanItem(item){
        var cleanedItem = {};

        cleanedItem.title = item.title;
        cleanedItem.packageId = item.packageId;
        cleanedItem.confidential =  item.confidential ? item.confidential : false ;
        cleanedItem.path = item.path;
        cleanedItem.contentType = item.content_type ? item.content_type :"";
        cleanedItem.size = item.stream_size;
        return cleanedItem;
    }
    $scope.submitMethod = function(ev, formData){
        // Preprocssing order before POSTing
        var formDataCopy = angular.copy(formData);
        var finalOrder = { order: $scope.compileOrder(formDataCopy) };
        
        basketService.submitOrder(finalOrder).then(function(response) {
            if(response){
                //clean everything if successful
                basketService.currentSearch = {};
                basketService.basket =  bdc.basket = [];
                $state.go('orderBrowse');
            }
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

/*
 * Basket directive
 */
function basketDirective() {
    return {
        restrict:'E',
        templateUrl : 'app/src/common/directives/basket/view/basket.html',
        scope: {}
    };
}
