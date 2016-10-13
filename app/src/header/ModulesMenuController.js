angular
    .module('eArkPlatform.header')
    .controller('ModulesMenuController', ModulesMenuController);

function ModulesMenuController(modulesMenuService, sessionService, $state) {
    
    var vm = this;
    
    modulesMenuService.fixPerms(sessionService.getUserInfo().user);
    
    vm.items = modulesMenuService.getItems();
    
    vm.state = $state;
    
}