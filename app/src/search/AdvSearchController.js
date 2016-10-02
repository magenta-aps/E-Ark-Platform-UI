angular
    .module('eArkPlatform.search')
    .controller('AdvSearchController', AdvSearchController);

/**
 * Main Controller for the Search module
 * @param $scope
 * @constructor
 */
function AdvSearchController($scope, $state, searchService, basketService, fileUtilsService, $mdDialog) {
    
    var sctrl = this;
    
    sctrl.searchStr = '';
    sctrl.initialTerm = '';
    sctrl.searchInputs = [];
    sctrl.searchResults = {};
    sctrl.orderBy = '';
    sctrl.filterBy = { title: '', packageId: '' };
    sctrl.state = $state;
    
    sctrl.executeSearch = executeSearch;
    sctrl.sortThis = sortThis;
    sctrl.addInput = addInput;
    sctrl.removeInput = removeInput;
    sctrl.helpfulSearchHints = helpfulSearchHints;
    sctrl.fileInfoDiag = fileInfoDiag;
    sctrl.addToBasket = basketCheck;
    
    function executeSearch() {
        
        sctrl.searchStr = 'content: ' + sctrl.initialTerm;
        
        for (var i in sctrl.searchInputs) {
            if (sctrl.searchInputs[i].term !== '') {
                sctrl.searchStr = sctrl.searchStr + ' ' + sctrl.searchInputs[i].operator + ' content: ' + sctrl.searchInputs[i].term + '';
            };
        };
    
        sctrl.searchResults = {};
        var queryObj = {
            q: sctrl.searchStr + ' AND path:*/representations/*/data/* AND NOT path:*_mig-*',
            rows: 25,
            start: 0,
            wt: "json",
            filter: 'package, size, path, confidential, contentType, textCategory',
            sort :'package asc'
        };
        var encTerm = searchService.objectToQueryString(queryObj);

        searchService.aipSearch(encTerm).then(function (response) {
            if (response.numFound > 0) {
                basketService.currentSearch = {
                    documents: response.docs, //An array of objects
                    numberFound: response.numFound
                };
                
                //Let's clean up some of the properties. Temporary solution
                basketService.currentSearch.documents.forEach(function (item) {
                    item.title = item.path.substring(item.path.lastIndexOf('/') + 1, item.path.lastIndexOf('.'));
                    if(item.package) {
                        item.packageId = item.package.substring(item.package.lastIndexOf(':') + 1);
                    };
                    item.thumbnail = fileUtilsService.getFileIconByMimetype(item.contentType, 24);
                    item.displaySize = formatBytes(item.stream_size);
                });
                sctrl.searchResults = basketService.currentSearch;
            }
        });
    }
    
    function addInput() {
        sctrl.searchInputs.length
        var inputObj = { term: '', operator: 'OR' };
        sctrl.searchInputs.push( inputObj );
        sctrl.searchInputs[0].operator = '';
    }
    
    function removeInput(inputObj) {
        var i = sctrl.searchInputs.indexOf(inputObj);
        sctrl.searchInputs.splice(i, 1);
    }
    
    function sortThis( $event, sortParameter ) {
        if (sctrl.orderBy === sortParameter) {
            sctrl.orderBy = '-' + sortParameter;
        } else if (sctrl.orderBy === '-' + sortParameter) {
            sctrl.orderBy = '';
        } else {
            sctrl.orderBy = sortParameter;
        }
    }
    
    function formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    function helpfulSearchHints(ev) {
        $mdDialog.show(
          $mdDialog.alert()
            //.parent(angular.element(document.querySelector('#adv-search-help')))
            .clickOutsideToClose(true)
            .title('Advanced search help')
            .textContent('You can use * and "" to enhance your search. Try "Albert Einstein" or Einst*')
            .ariaLabel('Advanced search help')
            .ok('Got it!')
            .targetEvent(ev)
        );
    }
    
    function basketCheck(item) {
        if (item.baskOp === 'add') {
            basketService.addToBasket(item);
        };
        if (item.baskOp === 'delete') {
            basketService.removeFromBasket(item).then(function (result) {
                console.log('Removal status: ' + result);
            });
        };
    }
    
    
    /**
     * Dialog to show info on individual files
     */
    
    function fileInfoDiag(ev, doc) {
        $mdDialog.show({
          controller: fileInfoDialogController,
          templateUrl: 'app/src/order/view/fileInfoDiag.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          locals: { document: doc },
          clickOutsideToClose: true,
          fullscreen: true
        });
    };
    
    function fileInfoDialogController($scope, $mdDialog, document) {
        var fidc = this;
        
        $scope.doc = document;
        
        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    };

}