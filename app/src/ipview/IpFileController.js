angular
    .module('eArkPlatform.ipview')
    .controller('IpFileController', IpFileController);

function IpFileController($sce, $scope, $stateParams, $window, ipViewService) {

    var ipfc = this;
    
    ipfc.data = false;
    ipfc.info = {};
    ipfc.filePath = $stateParams.path;
    ipfc.fileName = getFileName(ipfc.filePath);
    ipfc.download = download;
    ipfc.orderStatus = $stateParams.orderStatus ? $stateParams.orderStatus : '';

    
    
    function getFileContent() {
        var contentAction = ipViewService.serializeObj({ action: 'getcontent', path: ipfc.filePath, orderStatus: ipfc.orderStatus});
        var infoAction = ipViewService.serializeObj({ action: 'getinfo', path: ipfc.filePath });
        ipViewService.executeAction(contentAction).then(
            function (response) {
                if (response === undefined) {
                    console.log('No content for this file: ' + ipfc.filePath);
                } else {
                    ipfc.data = response;
                    $scope.trustedResource = $sce.trustAsResourceUrl(response.preview_url);
                }
            },
            function (err) {
                console.log('Error getting file content: ' + err.message);
                errorService.displayErrorMsg( $translate.instant('IPVIEW.ERROR.MESSAGE.GET_CONTENT_ERROR') );
            }
        );
    }
    
    
    function getFileName(path) {
        var paths = path.split('/');
        return paths[paths.length - 1];
    }

    
    function download() {
        $window.open(ipfc.data.download_url);
    }
    
    
    getFileContent();

}