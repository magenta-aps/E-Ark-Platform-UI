angular.module('eArkPlatform.ordermanagement', [ 'ngMaterial', 'pascalprecht.translate']).config(config);

function config(modulesMenuServiceProvider, $stateProvider, USER_ROLES) {
    
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/order_management/view/menuItem.html',
        order: 2
    });
    
    $stateProvider.state('orderList', {
        parent: 'site',
        url: '/orders/list',
        views: {
            'content@': {
                templateUrl: 'app/src/order_management/view/orders-list.html',
                controller: 'OrdersListController',
                controllerAs: 'olCtrl'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.user]
        }
    }).state('orderDetail', {
        parent: 'site',
        url: '/orders/order/:orderid',
        views: {
            'content@': {
                templateUrl: 'app/src/order_management/view/order-detail.html',
                controller: 'OrderDetailController',
                controllerAs: 'odCtrl'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.user]
        }
    });
       
}