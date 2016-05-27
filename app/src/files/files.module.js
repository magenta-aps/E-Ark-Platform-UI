angular
    .module('angularStubApp.files', ['ngMaterial'])
    .config(config);

function config(modulesMenuServiceProvider) {
    console.log('This should work');
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/files/view/menuItem.html',
        order: 1
    });
    console.log(modulesMenuServiceProvider.$get);
}
