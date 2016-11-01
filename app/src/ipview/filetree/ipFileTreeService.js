angular
    .module('eArkPlatform.ipview')
    .service('ipFileTreeService', ipFileTreeService);

function ipFileTreeService(ipViewService) {

    var ftSvc = this;
    
    ftSvc.tree = { name: 'root', path: '/', nodes: [] };
    ftSvc.getTree = getTree;
    ftSvc.buildTree = buildTree;
    
    function getTree() {
        return ftSvc.tree;
    }
    
    function buildTree(path) {
        
        var lvls = path.split('/');
        
        function traverseTree(nodes, paths, pathIndex) {
            var fullPath = '';
            var newPathIndex = pathIndex + 1;
            function getNodes(nodePath, insertNode) {
                ipViewService.listDir(nodePath).then(
                    function (response) {
                        insertNode.nodes = response;
                        traverseTree(insertNode.nodes, lvls, newPathIndex);
                    }
                );
            };
            for (var pi = pathIndex; pi > 0; pi--) {
                fullPath = '/' + paths[pi] + fullPath;
            };
            for (var node in nodes) {
                if (nodes[node].path === fullPath) {
                    if (!nodes[node].nodes) {
                        getNodes(nodes[node].path, nodes[node]);
                    } else {
                        traverseTree(nodes[node].nodes, lvls, newPathIndex);
                    };
                };
            };
        };
        
        ipViewService.listDir('/' + lvls[1]).then(
            function (response) {
                ftSvc.tree.nodes = response;
                traverseTree(ftSvc.tree.nodes, lvls, 2);
            }
        );
        
    }
        
    return ftSvc;
    
}
