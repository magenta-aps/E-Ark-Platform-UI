angular
    .module('angularStubApp.files', ['ngMaterial'])
    .config(config);

function config(modulesMenuServiceProvider) {
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/files/view/menuItem.html',
        order: 2
    });
}
