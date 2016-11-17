angular
    .module('eArkPlatform.ipview')
    .controller('IpController', IpController);

function IpController($q, $state, $stateParams, ipViewService, orderService) {

    var ipc = this;

    ipc.orderId = $stateParams.orderId;
    ipc.path = '/';
    ipc.children = [];
    ipc.orderBy = '-name';
    ipc.searchForm = {};
    ipc.itemInfo = false;

    ipc.bcpath = pathToBreadCrumb(ipc.path);
    ipc.itemName = ipc.bcpath[ipc.bcpath.length - 1].title;
    ipc.viewContent = viewContent;
    ipc.sortThis = sortThis;
    ipc.searchIP = searchIp;
    ipc.toggleSearchField = toggleSearchField;
    ipc.order = '';

    resolvePath();

    function resolvePath() {
        var defer = $q.defer();
        if ($stateParams.orderId) {
            orderService.getOrderDetail(ipc.orderId).then(function (response) {
                ipc.order = response;
                ipc.path += response.processId;
                listDir();
                defer.resolve(true);
            });
        }
        else {
            // The we need tnot do anything and end up browsing directory root
            defer.resolve(true);
            listDir();
        }

        return defer.promise;
    }

    function listDir() {
        getItemInfo(ipc.path);
        var action = ipViewService.serializeObj({action: 'list', path: ipc.path});
        ipViewService.executeAction(action).then(
            function (response) {
                ipc.children = response.children;
            },
            function (err) {
                console.log('Error listing directory contents' + err.message);
                errorService.displayErrorMsg($translate.instant('IPVIEW.ERROR.MESSAGE.DIR_LISTING_ERROR'));
            }
        );
    }

    function viewContent(item) {
        if (item.type === 'directory') {
            $state.go('ipview.ip', {path: item.path});
        } else {
            $state.go('ipview.file', {path: item.path});
        }
    }

    function getItemInfo(path) {
        var action = ipViewService.serializeObj({ action: 'getinfo', path: path });
        console.log('getting item info for ' + path);
        var action = ipViewService.serializeObj({action: 'getinfo', path: path});
        ipViewService.executeAction(action).then(
            function (response) {
                if (response !== undefined && response.error !== 404) {
                    console.log('There is a response');
                    console.log(response);
                    ipc.itemInfo = response;
                }
            },
            function (err) {
                console.log('Error: ' + err.message);
            }
        );
    }
    
    
    // Clean up response data for UI itemInfo
    function dataDigest(obj) {
        Object.keys(obj).forEach(function (key) {
            if(typeof obj[key] === 'object') {
                dataDigest(obj[key]);
            } else {
                var readableKey = key.replace(/[@#]/g, '');
                ipc.itemInfo.push({ label: readableKey, value: obj[key] });
            };
        });
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
            }
        }
        return bc;
    }

    function sortThis($event, sortParameter) {
        if (ipc.orderBy === sortParameter) {
            ipc.orderBy = '-' + sortParameter;
        } else if (ipc.orderBy === '-' + sortParameter) {
            ipc.orderBy = '';
        } else {
            ipc.orderBy = sortParameter;
        }
    }

    function searchIp(term) {
        $state.go('ipview.search', {path: ipc.bcpath[0].path, term: term});
    }

    function toggleSearchField() {
        !ipc.searchForm.visible ? ipc.searchForm.visible = true : ipc.searchForm.visible = false;
    }

}
