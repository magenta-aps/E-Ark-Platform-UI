
    angular
        .module('angularStubApp')
        .filter('isEmpty', isEmptyFilterFactory);

    function isEmptyFilterFactory() {
        return function (obj) {
            for (var key in obj) {
                return false;
            }
            return true;
        }
    }