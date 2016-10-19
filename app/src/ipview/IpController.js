angular
    .module('eArkPlatform.ipview')
    .controller('IpController', IpController);

function IpController($state, ipViewService, $stateParams) {
    
    var ipc = this;
    
    ipc.name = $stateParams.name;
    ipc.path = $stateParams.path;
    ipc.children = {};
    
    ipc.viewContent = viewContent;
    
    ipViewService.listDir(ipc.path).then(
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
        console.log(file.type);
        if (file.type === 'directory') {
            $state.go('ipview.ip', { path: file.path, name: ipc.name });
        } else {
            $state.go('ipview.file', { path: file.path, name: ipc.name });
        };
    }
    
}