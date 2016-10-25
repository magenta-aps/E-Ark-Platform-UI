angular
    .module('eArkPlatform.ipview')
    .controller('IpFileController', IpFileController);

function IpFileController($stateParams, ipViewService) {

    var ipfc = this;

    ipfc.data = {};
    ipfc.filePath = $stateParams.path;
    ipfc.ipName = $stateParams.name;
    ipfc.parentPath = ipfc.filePath.substring(0, ipfc.filePath.lastIndexOf("/"));

        ipViewService.getcontent(ipfc.filePath).then(
        function (response) {
            console.log('Got response');
            ipfc.data = response;
        },
        function (response) {
            console.log('Something went wrong');
        }
    )

}