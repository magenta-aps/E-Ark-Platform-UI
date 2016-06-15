angular.module('eArkPlatform.order', [ 'ngMaterial', 'pascalprecht.translate']).config(config);

function config(modulesMenuServiceProvider, USER_ROLES) {
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/order/view/menuItem.html',
        order: 1,
        authorizedRole: USER_ROLES.endUser
    });
}