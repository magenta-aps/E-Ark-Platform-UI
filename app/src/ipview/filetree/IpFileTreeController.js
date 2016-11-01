angular
    .module('eArkPlatform.ipview')
    .controller('IpFileTreeController', IpFileTreeController)
    .directive('fileTree', fileTree);


function IpFileTreeController($stateParams, ipFileTreeService) {
    
    var ftc = this;
        
    ftc.path = $stateParams.path;
    ipFileTreeService.buildTree(ftc.path);
    ftc.tree = ipFileTreeService.getTree();
    
}


function fileTree() {
    return {
        restrict: 'E',
        templateUrl: './app/src/ipview/filetree/view/filetree.html',
        scope: {}
    };
}
