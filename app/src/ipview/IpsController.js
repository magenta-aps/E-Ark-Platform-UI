angular
    .module('eArkPlatform.ipview')
    .controller('IpsController', IpsController);

function IpsController(ipViewService) {
    
    var ipsc = this;
    
    ipsc.ips = ipViewService.listIps('insert user here');
      
}