angular
    .module('eArkPlatform', [
        'ngSanitize',
        'ngMaterial',
        'ngMessages',
        'material.wizard',
        'ui.router',
        'rt.encodeuri',
        'ngResource',
        'pdf',
        'swfobject',
        'isteven-multi-select',
        'eArkPlatform.init',
        'eArkPlatform.translations.init',
        'eArkPlatform.header',
        'eArkPlatform.files',
        'eArkPlatform.dashboard',
        'eArkPlatform.search',
        'eArkPlatform.documents',
        'eArkPlatform.administration',
        'eArkPlatform.users',
        'eArkPlatform.systemsettings',
        'eArkPlatform.common.directives',
        'eArkPlatform.common.directives.filter',
        'dcbImgFallback',
        /*DO NOT REMOVE MODULES PLACEHOLDER!!!*/ //openDesk-modules
        /*LAST*/ 'eArkPlatform.translations'])// TRANSLATIONS IS ALWAYS LAST!
    .config(config)
    .run(function ($rootScope, $state, $mdDialog, authService, sessionService, APP_CONFIG) {
        angular.element(window.document)[0].title = APP_CONFIG.appName;
        $rootScope.appName = APP_CONFIG.appName;

        $rootScope.$on('$stateChangeStart', function (event, next, params) {
            $rootScope.toState = next;
            $rootScope.toStateParams = params;
            if (next.data.authorizedRoles.length === 0) {
                return;
            }

            if (authService.isAuthenticated() && authService.isAuthorized(next.data.authorizedRoles)) {
                //We do nothing. Attempting to transition to the actual state results in call stack exception
            } else {
                event.preventDefault();
                sessionService.retainCurrentLocation();
                $state.go('login');
            }

            // If we got any open dialogs, close them before route change
            $mdDialog.cancel();
        });
    });

function config($mdThemingProvider, $stateProvider, $urlRouterProvider, USER_ROLES) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('yellow')
        .warnPalette('deep-orange');

    $urlRouterProvider
        .otherwise('/');

    $stateProvider.state('site', {
        abstract: true,
        resolve: {
            authorize: ['authService', function (authService) {
            }]
        },
        views: {
            'footer@': {
                templateUrl: 'app/src/footer/view/footer.html',
                controller: 'FooterController'
            },
            'header@': {
                templateUrl: 'app/src/header/view/header.html',
                controller: 'HeaderController',
                controllerAs: 'vm'
            }
        }
    }).state('dashboard', {
        parent: 'site',
        url: '/',
        views: {
            'content@': {
                templateUrl: 'app/src/dashboard/view/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'vm'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.user]
        }
    }).state('login', {
        parent: 'site',
        url: '/login?error&nosso',
        views: {
            'content@': {
                templateUrl: 'app/src/authentication/view/login.html',
                controller: 'AuthController',
                controllerAs: 'vm'
            },
            'header@': {},
            'footer@': {}
        },
        data: {
            authorizedRoles: []
        }
    }).state('files', {
        parent: 'site',
        url: '/files',
        views: {
            'content@': {
                templateUrl: 'app/src/files/view/files.html',
                controller: 'FilesController',
                controllerAs: 'vm'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.user]
        }
    }).state('search', {
        parent: 'site',
        url: '/search/:searchTerm',
        views: {
            'content@': {
                templateUrl: 'app/src/search/view/search.html'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.user]
        }
    });
}