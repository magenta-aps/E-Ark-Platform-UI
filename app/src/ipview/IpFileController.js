angular
    .module('eArkPlatform.ipview')
    .controller('IpFileController', IpFileController);

function IpFileController($stateParams, ipViewService) {
    
    var ipfc = this;
    
    ipfc.data = {};
    ipfc.filePath = $stateParams.path;
    ipfc.ipName = $stateParams.name;
    
    ipViewService.getcontent(ipfc.filePath).then(
        function(response) {
            if (!response) {
                console.log('No response');
            } else {
                console.log('Got response');
                ipfc.data = response;
            };
        },
        function(response) {
            console.log('Something went wrong');
        }
    )
    
}