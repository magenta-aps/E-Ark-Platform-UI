angular
    .module('eArkPlatform.ipview')
    .controller('IpFileTreeController', IpFileTreeController)
    .directive('fileTree', fileTree);


function IpFileTreeController($scope, ipFileTreeService) {
    
    var ftc = this;
    ftc.tree = {};
    
    ipFileTreeService.getTree($scope.path, $scope.orderstatus).then(
        function (response) {
            ftc.tree = response.data;
            console.log('Got tree data');
            console.log(ftc.tree);
        },
        function (err) {
            console.log('Error retrieving file tree data: ' + err);
        }
    );
    
}


function fileTree() {
    return {
        restrict: 'E',
        templateUrl: './app/src/ipview/filetree/view/filetree.html',
        scope: {
            path: '=path',
            orderstatus: '=orderstatus'
        }
    };
}
