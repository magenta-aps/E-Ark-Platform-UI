
angular
    .module('angularStubApp')
    .directive('appFooter', function() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'app/src/footer/view/footer.html'
        };
    });