angular
    .module('eArkPlatform.ipview')
    .service('ipViewService', ipViewService);

function ipViewService($http) {

    var observerCallbacks = [];
    var ipSvc = this;
    
    ipSvc.dirItems = [];
    ipSvc.clipboard = [];
    
    ipSvc.listDir = listDir;
    ipSvc.listIpRoot = listIpRoot;
    ipSvc.getcontent = getcontent;
    ipSvc.executeAction = executeAction;
    ipSvc.serializeObj = serializeObj;
    ipSvc.registerObserverCallback = registerObserverCallback;


    /**
     * This method lists all the Ips in the root dir. Only meant for admin purposes but for now required.
     * @returns {*}
     */
    function listIpRoot() {
        return $http({
            method: 'POST',
            url: '/ip_viewer?',
            data: serializeObj({action: "list", path: "/"}),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(function (response) {
            ipSvc.dirItems = response.data.children;
            notifyObservers();
            return response.data.children;
        });
    }
    
    /**
     * This method lists all the Ips in the root dir. Only meant for admin purposes but for now required.
     * @returns {*}
     */
    function getObject() {
        return $http({
            method: 'POST',
            url: '/ip_viewer?',
            data: serializeObj({action: "list", path: "/"}),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(function (response) {
            ipSvc.dirItems = response.data.children;
            notifyObservers();
            return response.data.children;
        });
    }

    function executeAction(command){
        return $http({
            method: 'POST',
            url: '/ip_viewer?',
            data: command,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(
            function (response) {
                ipSvc.dirItems = response.data;
                notifyObservers();
                return response.data;
            },
            function (err) {
                console.log('no response ' + err);    
            }
        );

    }
    
    /**
     * Will list a collection of IPs that the user hass access to view.
     * @param user
     */
    function getUserIPRootDir(user) {
        // List DIPs available to a user
        //For now we'll just use the IP root

    }
    
    function listDir(path) {
        return $http({
            method: 'POST',
            url: '/ip_viewer?',
            data: serializeObj({action: "list", path: path}),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(
            function (response) {
                // Success
                return response.data.children;
            },
            function (response) {
                // Error
                return response.data;
            }
        );
    }

    function getcontent(filepath) {
        return $http({
            method: 'POST',
            url: '/ip_viewer?',
            data: serializeObj({action: "getcontent", path: filepath}),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(
            function (response) {
                // Success
                return response.data;
            },
            function (response) {
                // Error
                return response.data;
            }
        );
    }

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    function serializeObj(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += serializeObj(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    }

    //register an observer
    function registerObserverCallback(callback) {
        observerCallbacks.push(callback);
    }

    //call this when repoItems has been changed
    function notifyObservers() {
        angular.forEach(observerCallbacks, function (callback) {
            callback();
        });
    }
}
