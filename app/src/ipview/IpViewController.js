angular
    .module('eArkPlatform.ipview')
    .controller('IpsController', IpsController);

function IpsController(ipViewService) {
    
    var ipsc = this;
    
    ipsc.ips = [];
    ipViewService.registerObserverCallback(initDirRoot);

    function getIpRootDir() {
        ipViewService.listIpRoot();
    }
    
    function initDirRoot() {
        ipsc.ips = ipViewService.dirItems;
    }

    getIpRootDir();
    
}