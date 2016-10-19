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
                templateUrl : 'app/src/ipview/view/ips.html',
                controller : 'IpsController',
                controllerAs: 'ipsc'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    }).state('ipview.ip', {
        parent: 'site',
        url: '/ipviewer/:name/:path',
        views: {
            'content@': {
                templateUrl : 'app/src/ipview/view/ip.html',
                controller : 'IpController',
                controllerAs: 'ipc'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    }).state('ipview.file', {
        parent: 'site',
        url: '/ipviewer/:name/:path',
        views: {
            'content@': {
                templateUrl : 'app/src/ipview/view/ip_file.html',
                controller : 'IpFileController',
                controllerAs: 'ipfc'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    });

    languageFilesProvider.addFile('app/src/ipview/i18n/','-ipview.json');

}