angular
    .module('eArkPlatform.ipview')
    .controller('IpController', IpController);

function IpController($q, $state, $stateParams, $mdDialog, ipViewService, orderService) {

    var ipc = this;

    ipc.orderId = $stateParams.orderId;
    ipc.children = [];
    ipc.orderBy = '-name';
    ipc.searchForm = {};
    ipc.itemInfo = false;
    ipc.path = $stateParams.path ? $stateParams.path : '/';
    ipc.orderStatus = $stateParams.orderStatus ? $stateParams.orderStatus : '';
    
    ipc.bcpath = pathToBreadCrumb(ipc.path);
    ipc.viewContent = viewContent;
    ipc.sortThis = sortThis;
    ipc.searchIP = searchIp;
    ipc.toggleSearchField = toggleSearchField;
    ipc.order = '';
    ipc.statusEnum = {
        error: 0,
        new : 1,
        open : 2,
        submitted : 3,
        processing : 4,
        packaging : 5,
        ready : 6
    };
    if ($stateParams.linkBack) {
        ipc.linkBack = $stateParams.linkBack;
    } else {
        ipc.linkBack = false;
    }
    
    resolvePath();

    function resolvePath() {
        var defer = $q.defer();
        if ($stateParams.orderId) {
            orderService.getOrderDetail(ipc.orderId).then(function (response) {
                ipc.order = response;
                listDir();
                defer.resolve(true);
            });
        } else {
            defer.resolve(true);
            listDir();
        }
        return defer.promise;
    }

    function listDir() {
        if(ipc.path)
            getItemInfo(ipc.path);
        var orderStatus  = '';
        if(ipc.order && ipc.order.orderStatus){
            orderStatus = ipc.order.orderStatus;
            if(ipc.statusEnum[ipc.order.orderStatus] > 4 && ipc.path.split("/").length < 2)
                ipc.path = ipc.order.dipId
        }

        var action = ipViewService.serializeObj({action: 'list', path: ipc.path, orderStatus: orderStatus});
        ipViewService.executeAction(action).then(function(response) {
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
            $state.go('ipviewer', {path: item.path});
        } else {
            $state.go('ipviewer.file', {path: item.path});
        }
    }

    function getItemInfo(path) {
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
            }
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
        $state.go('ipviewer.search', {path: ipc.bcpath[0].path, term: term});
    }

    function toggleSearchField() {
        !ipc.searchForm.visible ? ipc.searchForm.visible = true : ipc.searchForm.visible = false;
    }
    
    
    // Processing/editing features
    
    ipc.can_edit = $stateParams.orderStatus === 'processing';;
    ipc.clipboard = ipViewService.clipboard;
    ipc.copy = copy;
    ipc.mkdir = mkdir;
    ipc.paste = paste;
    ipc.del = del;
    
    function copy(path) {
        ipViewService.clipboard = path;
        ipc.clipboard = path;
    }
    
    function mkdir(ev, path) {
        var parentEl = angular.element(document.body);
        $mdDialog.show({
            parent: parentEl,
            targetEvent: ev,
            templateUrl: 'app/src/ipview/view/mkdirDiag.html',
            locals: {
                
            },
            controller: DialogController
        });
        function DialogController($scope, $mdDialog) {
            $scope.dirName = '';
            $scope.closeDialog = function() {
                $mdDialog.hide();
            };
            $scope.createDir = function() {
                $mdDialog.hide();
                var newPath = path + '/' + $scope.dirName;
                var action = ipViewService.serializeObj({ action: 'mkdir', path: newPath });
                ipViewService.executeAction(action).then(
                    function (response) {
                        console.log('Folder created');
                        resolvePath();
                    },
                    function (err) {
                        alert('Cannot create folder');
                        console.log(err);
                    }
                );
            };
        };
    }
    
    function paste(path) {
        console.log('Copying:');
        console.log(ipc.clipboard);
        console.log(path);
        var action = ipViewService.serializeObj({ action: 'copy', source: ipc.clipboard, destination: path });
        ipViewService.executeAction(action).then(
            function (response) {
                console.log('Content copied');
                console.log(response);
                ipc.clipboard = '';
                ipViewService.clipboard = '';
                resolvePath();
            },
            function (err) {
                alert('Cannot copy content');
                console.log(err);
            }
        );
    }
    
    function del(path) {
        console.log('Deleting ' + path);
        var action = ipViewService.serializeObj({ action: 'delete', path: path });
        ipViewService.executeAction(action).then(
            function (response) {
                console.log('Content deleted');
                resolvePath();
            },
            function (err) {
                alert('Cannot delete content');
                console.log(err);
            }
        );
    }

}
