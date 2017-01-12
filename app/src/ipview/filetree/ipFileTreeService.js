angular
    .module('eArkPlatform.ipview')
    .service('ipFileTreeService', ipFileTreeService);

function ipFileTreeService($http, ipViewService) {

    var ftSvc = this;
    var tree = {};
    
    ftSvc.buildTree = buildTree;
    
    function buildTree(path, orderStatus){
        var action = ipViewService.serializeObj({ action: 'gettree', path: path, orderStatus: orderStatus });
        return $http({
            method: 'POST',
            url: '/ip_viewer?',
            data: action,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(
            function (response) {
                return response;
            },
            function (err) {
                console.log('no gettree response ' + err);    
            }
        );
    }
    
    return ftSvc;
}
