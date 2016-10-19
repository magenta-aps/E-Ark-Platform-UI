angular
    .module('eArkPlatform.ipview')
    .controller('IpController', IpController);

function IpController($state, ipViewService) {
    
    var ipc = this;
    
    ipc.children = {};
    
    ipc.viewContent = viewContent;
    
    ipViewService.list().then(
        function(response) {
            if (!response) {
                console.log('no response');
            } else {
                console.log('got response');
                ipc.children = response.children;
            };
        },
        function(response) {
            console.log('no response at all');
        }
    );
    
    function viewContent(file) {
        if (file.type !== 'directory') {
            $state.go('ipview.file', file);
        };
    }
    
}