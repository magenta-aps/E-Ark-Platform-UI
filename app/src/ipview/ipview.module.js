angular
    .module('eArkPlatform.ipview', ['ngMaterial', 'pascalprecht.translate'])
    .config(config);

function config($stateProvider, languageFilesProvider, USER_ROLES, modulesMenuServiceProvider){
    
    modulesMenuServiceProvider.addItem({
        templateUrl: 'app/src/ipview/view/moduleMenuItem.html',
        order: 2,
        authorizedRole: USER_ROLES.enduser
    });

    $stateProvider.state('ipview', {
        parent: 'site',
        url: '/ipviewer',
        views: {
            'content@': {
                templateUrl : 'app/src/ipview/view/ipview.html',
                controller : 'IpviewController',
                controllerAs: 'ipvc'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    }).state('ipview.ip', {
        parent: 'site',
        url: '/ipviewer/ip',
        views: {
            'content@': {
                templateUrl : 'app/src/ipview/view/ipview_ip.html',
                controller : 'IpviewController',
                controllerAs: 'ipvc'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    });

    languageFilesProvider.addFile('app/src/ipview/i18n/','-ipview.json');

}