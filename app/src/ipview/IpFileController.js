angular
    .module('eArkPlatform.ipview')
    .controller('IpFileController', IpFileController);

function IpFileController($sce, $scope, $stateParams, $window, ipViewService) {

    var ipfc = this;
    
    ipfc.data = {};
    ipfc.info = {};
    ipfc.previewUrl = '';
    ipfc.filePath = $stateParams.path;
    
    function getFileContent() {
        var contentAction = ipViewService.serializeObj({ action: 'getcontent', path: ipfc.filePath });
        var infoAction = ipViewService.serializeObj({ action: 'getinfo', path: ipfc.filePath });

        ipViewService.executeAction(contentAction).then(
            function (response) {
                ipfc.data = response;
            },
            function (err) {
                console.log('Error getting file content: ' + err.message);
                errorService.displayErrorMsg( $translate.instant('IPVIEW.ERROR.MESSAGE.GET_CONTENT_ERROR') );
            }
        );
        
        ipViewService.executeAction(infoAction).then(
            function (response) {
                if(response) {
                    ipfc.info = response;
                    if(response.preview_url) {
                        console.log( 'url: ' + response.preview_url);
                        $scope.previewUrl = $sce.trustAsResourceUrl(response.preview_url);
                    }
                }
            },
            function (err) {
                console.log('Error getting file info: ' + err.message);
                errorService.displayErrorMsg( $translate.instant('IPVIEW.ERROR.MESSAGE.GET_CONTENT_ERROR') );
            }
        );
    }
    
    getFileContent();


    ipfc.download = function(){
        $window.open(ipfc.data.download_url);
    }
}