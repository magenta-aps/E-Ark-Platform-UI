angular
    .module('eArkPlatform.ipview')
    .controller('IpController', IpController);

function IpController($state, ipViewService, $stateParams) {
    
    var ipc = this;
    
    console.log($stateParams);
    
    ipc.id = $stateParams.id;
    ipc.path = $stateParams.path;
    ipc.manageorder = $stateParams.manageorder;
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
            $state.go('ipview.ip', { path: file.path, id: ipc.id });
        } else {
            $state.go('ipview.file', { path: file.path, id: ipc.id });
        };
    }
    
}