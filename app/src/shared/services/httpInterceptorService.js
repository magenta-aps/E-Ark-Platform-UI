angular
    .module('eArkPlatform')
    .config(config)
    .factory('httpInterceptor', httpInterceptor);

function config($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
        // start the spinner here
        document.getElementById('loader').style.display = "block";
        return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
}

// register the interceptor as a service, intercepts ALL angular ajax http calls
function httpInterceptor($q, $window) {
    return {
        'response': function (response) {
            document.getElementById('loader').style.display = "none";
            return response;
        },

        'responseError': function (rejection) {
            document.getElementById('loader').style.display = "none";
            return $q.reject(rejection);
        }
    }
}