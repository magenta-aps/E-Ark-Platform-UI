angular
    .module('eArkPlatform.ipview')
    .controller('IpController', IpController);

function IpController($state, ipViewService, $stateParams) {
    var ipc = this;
    ipc.path = $stateParams.path;
    ipc.children = {};
    ipc.viewContent = viewContent;
    listDir();

    function listDir() {
        var action = ipViewService.serializeObj({mode: 'list', path: ipc.path});
        ipViewService.executeAction(action).then(
            function (response) {
                ipc.children = response.children;
            },
            function (err) {
                //Error response
                console.log('Error listing directory contents' + err.message);
                errorService.displayErrorMsg($translate.instant('IPVIEW.ERROR.MESSAGE.DIR_LISTING_ERROR'));
            })
    }

    function viewContent(file) {
        console.log(file.type);
        if (file.type === 'directory') {
            $state.go('ipview.ip', {path: file.path});
        } else {
            $state.go('ipview.file', { path: file.path, name: file.name });
        }
    }
}