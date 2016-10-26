angular
    .module('eArkPlatform.ipview', ['ngMaterial', 'pascalprecht.translate'])
    .config(config);

function config($stateProvider, languageFilesProvider, USER_ROLES, modulesMenuServiceProvider, $httpProvider){
    
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
        url: '/ipviewer:path',
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
        parent: 'ipview.ip',
        views: {
            'ip-content': {
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

    //Change the default http behaviour because the service doesn't recognise json yet.
    //Also see http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
    //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
   /* $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];*/

}