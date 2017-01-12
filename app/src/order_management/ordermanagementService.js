angular
    .module('eArkPlatform.ordermanagement')
    .factory('ordermanagementService', ordermanagementService);

function ordermanagementService($http, $filter) {
    var service = {
        getOrders: getOrders,
        getOrder: getOrder,
        getArchivists: getArchivists,
        updateOrder: updateOrder,
        processOrder: processOrder,
        packageOrder: packageOrder,
        getAllOrdersStatus: getAllOrdersStatus
    };

    return service;

    function getOrders() {
        return $http.get('/api/getOrders').then(
            function (response) {
                return response.data;
            }, function (response) {
                console.log('Error getting orders');
            }
        );
    }
    function getOrder(orderId) {
        return $http.get('/api/getOrderData?orderId=' + orderId).then(
            function (response) {
                return response.data;
            }, function (response) {
                console.log('Error getting order');
            }
        );
    }
    function updateOrder(queryObj) {
        console.log($filter('json')(queryObj));
        return $http.put('/api/updateOrder', $filter('json')(queryObj)).then(
            function (response) {
                return response.data;
            }, function (response) {
                console.log('Error updating order');
            }
        );
    }
    function getAllOrdersStatus() {
        return $http.get('/api/earkweb/updateAllOrderStatus').then(
            function (response) {
                console.log(response);
                return response;
            }, function (response) {
                console.log('Error getting statuses');
            }
        );
    }
    function getArchivists() {
        return $http.get('/api/getArchivists').then(
            function (response) {
                return response.data;
            }, function (response) {
                console.log('Error getting archivists');
            }
        );
    }
    //TODO: resolve this interface call
    function processOrder(order) {
        return $http.post('/api/earkweb/submitOrder', order).then(
            function (response) {
                console.log('Successfully posted the order for processing');
                return response.data;
            }, function (response) {
                console.log('There was an error posting the order for processing');
                return false;
            }
        );
    }
    function packageOrder(order) {
        return $http.post('/api/earkweb/createDIP', {"orderId":order}).then(
            function (response) {
                console.log('Successfully posted the order for packaging');
                return response.data;
            }, function (response) {
                console.log('There was an error posting the order for packaging');
                return false;
            }
        );
    }

}
