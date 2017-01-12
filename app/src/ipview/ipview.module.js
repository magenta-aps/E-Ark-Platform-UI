angular
    .module('eArkPlatform.ipview', ['ngMaterial', 'pascalprecht.translate'])
    .config(config);

function config($stateProvider, languageFilesProvider, USER_ROLES, $httpProvider){

    $stateProvider.state('ipviewer', {
        parent: 'site',
        url: '/ipviewer/:path/:orderId/:dipId/:orderStatus/:linkBack',
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
    }).state('ipviewer.file', {
        parent: 'ipviewer',
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
    }).state('ipviewer.search', {
        url: '/ipsearcher',
        parent: 'site',
        params: {
            path: '/none',
            term: 'none',
            dipId: 'none'
        },
        views: {
            'content@': {
                templateUrl : 'app/src/ipview/search/view/ip_search.html',
                controller : 'IpSearchController',
                controllerAs: 'sc'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.enduser]
        }
    });

    languageFilesProvider.addFile('app/src/ipview/i18n/','-ipview.json');

    //Change the default http behaviour because the service doesn't recognise json yet.
    //Also see http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/

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


}