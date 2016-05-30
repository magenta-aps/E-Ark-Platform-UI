angular.module('eArkPlatform.order', [ 'ngMaterial', 'pascalprecht.translate']).config(config);

function config(modulesMenuServiceProvider) {
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/order/view/menuItem.html',
        order: 3
    });
}