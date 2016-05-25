
    angular
        .module('angularStubApp.header')
        .controller('HeaderController', HeaderController);

    function HeaderController($scope, $mdSidenav) {
        var vm = this;
        
        vm.openMenu = function() {
            console.log('is working');
            $mdSidenav('left').toggle();  
        };
        
    };
