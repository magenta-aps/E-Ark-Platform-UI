angular.module('eArkPlatform.ordermanagement', [ 'ngMaterial', 'pascalprecht.translate']).config(config);

function config(modulesMenuServiceProvider, $stateProvider, USER_ROLES, languageFilesProvider) {
    
    languageFilesProvider.addFile('app/src/order_management/i18n/', '-orderman.json');
    
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/order_management/view/menuItem.html',
        order: 2,
        authorizedRole: USER_ROLES.archivist  //For now only one role is considered
    });
    
    $stateProvider.state('orderManageList', {
        parent: 'site',
        url: '/order-manage/list',
        views: {
            'content@': {
                templateUrl: 'app/src/order_management/view/orders-list.html',
                controller: 'OrdersListController',
                controllerAs: 'olCtrl'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.archivist]
        }
    }).state('orderManageDetail', {
        parent: 'site',
        url: '/order-manage/order/:orderid',
        views: {
            'content@': {
                templateUrl: 'app/src/order_management/view/order-detail.html',
                controller: 'OrderDetailController',
                controllerAs: 'odCtrl'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.archivist]
        }
    });
       
}