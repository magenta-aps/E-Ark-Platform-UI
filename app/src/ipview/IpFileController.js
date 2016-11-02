angular
    .module('eArkPlatform.ipview')
    .controller('IpFileController', IpFileController);

function IpFileController($stateParams, ipViewService) {

    var ipfc = this;
    
    ipfc.data = {};
    ipfc.info = {};
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
                ipfc.info = response;
            },
            function (err) {
                console.log('Error getting file info: ' + err.message);
                errorService.displayErrorMsg( $translate.instant('IPVIEW.ERROR.MESSAGE.GET_CONTENT_ERROR') );
            }
        );
    }
    
    getFileContent();

}