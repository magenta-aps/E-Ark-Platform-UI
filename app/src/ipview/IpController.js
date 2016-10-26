angular
    .module('eArkPlatform.ipview')
    .controller('IpController', IpController);

function IpController($state, ipViewService, $stateParams) {
    
    var ipc = this;

    ipc.path = $stateParams.path;
    ipc.children = {};
    ipc.bcpath = pathToBreadCrumb(ipc.path);
    ipc.viewContent = viewContent;
    
    listDir();

    function listDir() {
        var action = ipViewService.serializeObj({mode: 'list', path: ipc.path});
        ipViewService.executeAction(action).then(
            function (response) {
                ipc.children = response.children;
            },
            function (err) {
                console.log('Error listing directory contents' + err.message);
                errorService.displayErrorMsg($translate.instant('IPVIEW.ERROR.MESSAGE.DIR_LISTING_ERROR'));
            })
    }

    function viewContent(item) {
        console.log(item.type);
        if (item.type === 'directory') {
            $state.go('ipview.ip', { path: item.path });
        } else {
            $state.go('ipview.file', { path: item.path });
        };
    }
    
    function pathToBreadCrumb(path) {
        var bc = [];
        var pathParts = path.split('/');
        var currentPath = '';
        for (var p in pathParts) {
            if (pathParts[p] !== '') {
                currentPath = currentPath + '/' + pathParts[p];
                bc.push({
                    title: pathParts[p],
                    path: currentPath
                });
            };
        };
        return bc;
    }
}