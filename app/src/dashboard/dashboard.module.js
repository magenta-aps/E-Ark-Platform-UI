angular
    .module('eArkPlatform.dashboard', ['ngMaterial'])
    .config(config);

function config(modulesMenuServiceProvider) {
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/dashboard/view/menuItem.html',
        order: 1
    });
}