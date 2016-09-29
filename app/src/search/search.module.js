angular
    .module('eArkPlatform.search', ['ngMaterial', 'pascalprecht.translate'])
    .config(config);

function config($stateProvider, USER_ROLES) {

    $stateProvider.state('advSearch', {
        parent: 'site',
        url: '/advanced-search',
        views: {
            'content@': {
                templateUrl: 'app/src/search/view/adv-search.html',
                controller: 'AdvSearchController',
                controllerAs: 'sctrl'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    });
    
};
