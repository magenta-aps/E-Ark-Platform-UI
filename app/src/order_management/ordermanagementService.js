angular
    .module('eArkPlatform.ordermanagement')
    .factory('ordermanagementService', ordermanagementService);

function ordermanagementService($http, $filter) {
    var service = {
        getOrders: getOrders,
        getOrder: getOrder,
        getArchivists: getArchivists,
        updateOrder: updateOrder
    };

    return service;

    function getOrders() {
        return $http.get('/api/getOrders').then(
            function (response) {
                return response.data;
            }, function (response) {
                console.log('nasty error');
            }
        );
    };
    
    function getOrder(orderId) {
        return $http.get('/api/getOrderData?orderId=' + orderId).then(
            function (response) {
                return response.data;
            }, function (response) {
                console.log('nasty error');
            }
        );
    };
    
    function updateOrder(queryObj) {
        
        console.log($filter('json')(queryObj));
        return $http.put('/api/updateOrder', $filter('json')(queryObj)).then(
            function (response) {
                return response.data;
            }, function (response) {
                console.log('nasty error');
            }
        );
    };
    
    function getArchivists() {
        return $http.get('/api/getArchivists').then(
            function (response) {
                return response.data;
            }, function (response) {
                console.log('nasty error');
            }
        );
    };

}