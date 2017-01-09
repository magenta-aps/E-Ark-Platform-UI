angular
    .module('eArkPlatform.ipview')
    .controller('IpSearchController', IpSearchController);

function IpSearchController($stateParams, searchService, fileUtilsService, basketService, sessionService, $state, $mdDialog, $translate) {
    
    var sc = this;
    var user = sessionService.getUserInfo().user;
    
    sc.path = $stateParams.path;
    sc.searchStr = $stateParams.term;
    sc.dipId = $stateParams.dipId;
    sc.initialTerm = $stateParams.term;
    sc.searchInputs = [];
    sc.searchResults = basketService.currentSearch;
    sc.orderBy = 'title';
    sc.filterBy = { title: '', packageId: '' };
    sc.state = $state;
    
    sc.sortThis = sortThis;
    sc.executeSearch = executeSearch;
    sc.addInput = addInput;
    sc.removeInput = removeInput;
    sc.helpfulSearchHints = helpfulSearchHints;
    sc.navigateToFile = navigateToFile;
    sc.fileInfoDiag = fileInfoDiag;

    sc.executeSearch();

    
    function sortThis( $event, sortParameter ) {
        if (sc.orderBy === sortParameter) {
            sc.orderBy = '-' + sortParameter;
        } else if (sc.orderBy === '-' + sortParameter) {
            sc.orderBy = '';
        } else {
            sc.orderBy = sortParameter;
        }
    }
    function executeSearch() {
        
        sc.searchStr = 'path:' + sc.dipId + '* AND content:' + sc.initialTerm;
        
        for (var i in sc.searchInputs) {
            if (sc.searchInputs[i].term !== '') {
                sc.searchStr = sc.searchStr + ' ' + sc.searchInputs[i].operator + ' content: ' + sc.searchInputs[i].term + '';
            }
        }
        sc.searchResults = {};
        var queryObj = {
            q: sc.searchStr,
            rows: 25,
            start: 0,
            wt: 'json'
        };
        var encTerm = searchService.objectToQueryString(queryObj);

        searchService.aipSearch(encTerm).then(function (response) {
            console.log('got search result');
            console.log(response);
            if (response.numFound > 0) {
                basketService.currentSearch = {
                    documents: response.docs, //An array of objects
                    numberFound: response.numFound
                };
                
                //Let's clean up some of the properties. Temporary solution
                basketService.currentSearch.documents.forEach(function (item) {
                    item.title = item.path.substring(item.path.lastIndexOf('/') + 1, item.path.lastIndexOf('.'));
                    if(item.package)
                        item.packageId = item.package.substring(item.package.lastIndexOf(':') + 1);
                    item.thumbnail = fileUtilsService.getFileIconByMimetype(item.contentType, 24);
                    item.displaySize = formatBytes(item.stream_size);
                });
                sc.searchResults = basketService.currentSearch;
            }
        });
        
    }

    
    /**
     * Takes the content and returns only the necessary data that we need for each ordered item
     * @param item
     */
    function cleanItem(item){
        var cleanedItem = {};

        cleanedItem.title = item.title;
        cleanedItem.packageId = item.packageId;
        cleanedItem.confidential =  item.confidential;
        cleanedItem.path = item.path;
        cleanedItem.contentType = item.contentType;
        cleanedItem.size = item.stream_size;
        return cleanedItem;
    }

    
    function formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    
    
    function addInput() {
        var inputObj = { term: '', operator: 'OR' };
        sc.searchInputs.push( inputObj );
    }
    
    
    function removeInput(inputObj) {
        var i = sc.searchInputs.indexOf(inputObj);
        sc.searchInputs.splice(i, 1);
    }
    
    
    function helpfulSearchHints(ev) {
        $mdDialog.show(
          $mdDialog.alert()
            //.parent(angular.element(document.querySelector('#adv-search-help')))
            .clickOutsideToClose(true)
            .title( $translate.instant( 'ORDER.SEARCH.ADV_SEARCH_HELP' ) )
            .textContent( $translate.instant( 'ORDER.SEARCH.ADV_SEARCH_TXT' ) )
            .ariaLabel( $translate.instant( 'ORDER.SEARCH.ADV_SEARCH_HELP' ) )
            .ok( $translate.instant( 'COMMON.UNDERSTOOD' ) )
            .targetEvent(ev)
        );
    }
    
    
    function navigateToFile(path) {
        console.log(path);
        $state.go('ipviewer.file', { 'path': path, 'orderId': 1234, 'dipId': 124, 'orderStatus': 'ready', 'linkBack': '/' });
    }
    
    
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
    }
    function fileInfoDialogController($scope, $mdDialog, document) {
        var fidc = this;
        
        $scope.doc = document;
        
        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    }
}
