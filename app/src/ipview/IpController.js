angular
    .module('eArkPlatform.ipview')
    .controller('IpController', IpController);

function IpController($q, $state, $stateParams, $mdDialog, ipViewService, orderService) {

    var ipc = this;
    ipc.checkAll = false;
    ipc.workingDirectory = false;

    // Processing/editing features
    ipc.del = del;
    ipc.copy = copy;
    ipc.mkdir = mkdir;
    ipc.paste = paste;
    ipc.clipboard = ipViewService.clipboard;
    ipc.can_edit = $stateParams.orderStatus === 'processing';


    ipc.dipId = $stateParams.dipId;
    ipc.orderId = $stateParams.orderId;
    ipc.path = $stateParams.path ? $stateParams.path : '/';
    ipc.orderStatus = $stateParams.orderStatus ? $stateParams.orderStatus : '';
    ipc.orderName = '';

    ipc.children = [];
    ipc.searchForm = {};
    ipc.itemInfo = false;
    ipc.orderBy = '-name';
    ipc.selectedItems = [];

    ipc.bcpath = pathToBreadCrumb(ipc.path);
    ipc.sortThis = sortThis;
    ipc.searchIP = searchIp;
    ipc.selectAll = selectAll;
    ipc.selectItem = itemSelect;
    ipc.delSelected = delSelected;
    ipc.viewContent = viewContent;
    ipc.toClipboard = toClipboard;
    ipc.clearClipboard = clearClipboard;
    ipc.toggleSearchField = toggleSearchField;
    ipc.removeFromClipboard = removeFromClipboard;
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
    }
    else {
        ipc.linkBack = false;
    }
    
    resolvePath();

    /**
     * Gets the order based on the order ID.
     * The reason for executing this first is to be able to get other details relating to the order such as the order
     * state which would allow us to, for instance, be able to select the right path for browsing.
     * @returns {*}
     */
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
            ipc.orderName = ipc.order.title;
            orderStatus = ipc.order.orderStatus;
            if(ipc.statusEnum[ipc.order.orderStatus] > 4 && ipc.path.split("/").length <= 2) {
                ipc.path = ipc.order.dipId;
                ipc.workingDirectory = true;
            }
            if (ipc.path[0] != '/')
                ipc.path = '/'+ipc.path;
        }

        var action = ipViewService.serializeObj({action: 'list', path: ipc.path, orderStatus: orderStatus});
        ipViewService.executeAction(action).then(function(response) {
                ipc.children = response.children;
                //since we have new children, clear the selected items buffer
                ipc.selectedItems =[];
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
        $state.go('ipviewer.search', {path: ipc.bcpath[0].path, term: term, dipId: ipc.dipId});
    }

    function toggleSearchField() {
        !ipc.searchForm.visible ? ipc.searchForm.visible = true : ipc.searchForm.visible = false;
    }

    /**
     * Selects or deselects an item in view
     * @param item
     */
    function itemSelect(item){
        ipc.checkAll = false;
        if(item.selected){
            var pIndex = ipc.selectedItems.findIndex(function (selectedItem) {
                return selectedItem.path == item.path;
            });
            if(pIndex != -1){
                ipc.selectedItems.splice(pIndex, 1);
                item.selected = false;
            }
        }
        else{
            item.selected = true;
            ipc.selectedItems.push(item);
        }
    }

    /**
     * Selects all elements in current view
     */
    function selectAll(){
        if(ipc.selectedItems.length == ipc.children.length){
            ipc.children.forEach(function(item){
                item.selected = false;
            });
            ipc.selectedItems = [];
        }
        else {
            ipc.selectedItems = [];
            ipc.children.forEach(function (item) {
                item.selected = true;
                ipc.selectedItems.push(item);
            });
            console.log('Selected(all) items: ', ipc.selectedItems);
        }
    }
    
    function copy(item) {
        if(ipViewService.clipboard.length == 0){
            ipViewService.clipboard = [item];
            ipc.clipboard = ipViewService.clipboard;
        }
        else {
            ipViewService.clipboard.push(item);
        }
    }

    /**
     * Clears everything from the clip board
     */
    function clearClipboard() {
        ipViewService.clipboard = [];
        ipc.clipboard = [];
    }

    /**
     * Clears everything from the clip board
     */
    function toClipboard() {
        if (ipViewService.clipboard.length <= 0)
            ipViewService.clipboard = ipc.selectedItems;
        else
            ipViewService.clipboard.push(ipc.selectedItems);

        ipc.clipboard = ipViewService.clipboard;
    }

    /**
     * Removes a single item from the clipboard and consequently un-checks it in view.
     * NOTE:
     * Clearing the clipboard does not uncheck the remaining items but rather leaves them checked for another subsequent
     * action
     * @param item
     */
    function removeFromClipboard(item){
        itemSelect(item);
        var pIndex = ipViewService.clipboard.findIndex(function (selectedItem) {
            return selectedItem.path == item.path;
        });
        if(pIndex != -1){
            ipViewService.clipboard.splice(pIndex, 1);
        }
        console.log('Removing single item from clipboard: ',ipc.selectedItems);
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
        }
    }
    
    function paste(path) {
        console.log('Copying:');
        console.log(ipc.clipboard);
        console.log(path);
        var items = [];
        ipc.clipboard.forEach(function(item){
            items.push(item.path);
        });
        var action = ipViewService.serializeObj({ action: 'copy', source: items, destination: path });
        console.log("Action to be persisted: "+ action);
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

    /**
     * Deletes an item or multiple items.
     * A single item is converted to an array of 1 before being serialised.
     * @param path
     */
    function del(path) {
        console.log('Deleting ' + path);
        if(!angular.isArray(path))
            path = [path];
        var action = ipViewService.serializeObj({ action: 'delete', paths: path });
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

    /**
     * Used when deleting multiple targets
     */
    function delSelected(){
        console.log('Deleting:');
        console.log(ipc.selectedItems);
        var items = [];
        ipc.selectedItems.forEach(function(item){
            items.push(item.path);
        });
        del(items);
    }



}
