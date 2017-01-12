angular
    .module('eArkPlatform.ipview')
    .controller('IpsController', IpsController);

function IpsController(ipViewService) {
    
    var ipsc = this;
    
    ipsc.ips = [];
    ipViewService.registerObserverCallback(initDirRoot);

    function getIpRootDir() {
        ipViewService.listIpRoot().then(
            function(response) {
                console.log(ipsc.ips);
            },
            function() {
                console.log('Something went wrong');
            }
        );
        
    }
    
    function initDirRoot() {
        ipsc.ips = ipViewService.dirItems;
    }

    getIpRootDir();
    
}