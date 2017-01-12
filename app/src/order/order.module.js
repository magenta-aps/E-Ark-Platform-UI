angular.module('eArkPlatform.order', [ 'ngMaterial', 'pascalprecht.translate' ]).config(config);

function config(modulesMenuServiceProvider, $stateProvider, USER_ROLES, languageFilesProvider) {
    
    languageFilesProvider.addFile('app/src/order/i18n/', '-order.json');
    
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/order/view/menuItem.html',
        order: 1,
        authorizedRole: USER_ROLES.enduser
    });

    $stateProvider.state('orderSearch', {
        parent: 'site',
        url: '/order/search',
        views: {
            'content@': {
                templateUrl: 'app/src/order/view/search.html',
                controller: 'OrderController',
                controllerAs: 'ordCtrl'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    }).state('orderBrowse', {
        parent: 'site',
        url: '/order/my-orders',
        views: {
            'content@': {
                templateUrl: 'app/src/order/view/myOrders.html',
                controller: 'OrderController',
                controllerAs: 'ordCtrl'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    }).state('orderBasket', {
        parent: 'site',
        url: '/order/basket',
        views: {
            'content@': {
                templateUrl: 'app/src/order/view/basket.html',
                controller: 'OrderController',
                controllerAs: 'ordCtrl'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    }).state('orderDetail', {
        parent: 'site',
        url: '/order/my-orders/order/:orderId',
        views: {
            'content@': {
                templateUrl: 'app/src/order/view/order-detail.html',
                controller: 'MyOrderDetailController',
                controllerAs: 'oddCtrl'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    });

}


