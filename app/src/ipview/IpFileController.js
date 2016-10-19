angular
    .module('eArkPlatform.ipview')
    .controller('IpFileController', IpFileController);

function IpFileController(ipViewService) {
    
    var ipfc = this;
    
    ipfc.data = {};
    
    ipViewService.getcontent(filepath).then(
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