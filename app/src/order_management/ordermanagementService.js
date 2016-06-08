angular
    .module('eArkPlatform.ordermanagement')
    .factory('ordermanagementService', ordermanagementService);

function ordermanagementService($http) {
    var service = {
        getOrders: getOrders,
        getOrder: getOrder
    };

    return service;

    function getOrders() {
        return $http.get('http://eark.magenta.dk:5000/getOrders').then(
            function (response) {
                return response.data;
            }, function (response) {
                console.log('nasty error');
            }
        );
    };
    
    function getOrder(orderId) {
        return $http.get('http://eark.magenta.dk:5000/getOrderData?orderId=' + orderId).then(
            function (response) {
                return response.data;
            }, function (response) {
                console.log('nasty error');
            }
        );
    };

}