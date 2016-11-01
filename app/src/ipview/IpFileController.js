angular
    .module('eArkPlatform.ipview')
    .controller('IpFileController', IpFileController);

function IpFileController($stateParams, ipViewService) {

    var ipfc = this;
    
    ipfc.data = {};
    ipfc.filePath = $stateParams.path;
    //ipfc.parentPath = ipfc.filePath.substring(0, ipfc.filePath.lastIndexOf("/"));
    
    function getFileContent() {
        var action = ipViewService.serializeObj({ action: 'getcontent', path: ipfc.filePath });
        ipViewService.executeAction(action).then(
            function (response) {
                ipfc.data = response;
            },
            function (err) {
                console.log('Error getting file content: ' + err.message);
                errorService.displayErrorMsg( $translate.instant('IPVIEW.ERROR.MESSAGE.GET_CONTENT_ERROR') );
            }
        );
    }
    
    getFileContent();

}