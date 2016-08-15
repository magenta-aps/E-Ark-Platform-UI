angular
    .module('eArkPlatform.header')
    .controller('ModulesMenuController', ModulesMenuController);

function ModulesMenuController(modulesMenuService, sessionService) {
    var vm = this;
    modulesMenuService.fixPerms(sessionService.getUserInfo().user);
    vm.items = modulesMenuService.getItems();
}