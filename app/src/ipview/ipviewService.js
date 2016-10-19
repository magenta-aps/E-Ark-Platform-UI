angular
    .module('eArkPlatform.ipview')
    .service('ipViewService', ipViewService);

function ipViewService($http) {

    var service = {
        list: list
    };
    
    return service;

    function list() {
        return $http.post('/someapi', { mode: 'list', path: '/' }).then(
            function(response) {
                // Success    
            },
            function() {
                // Error
                // Returning fake data for now
                return {
                    "children": [
                        {
                          "date": "2016-10-04T13:39:49.499874", 
                          "name": "foo.txt", 
                          "path": "/foo.txt", 
                          "size": 67, 
                          "type": "file"
                        }, 
                        {
                          "date": "2016-07-15T21:39:06.363138", 
                          "name": "dir", 
                          "path": "/dir", 
                          "size": 4096, 
                          "type": "directory"
                        }, 
                        {
                          "date": "2016-09-12T14:24:24.897041", 
                          "name": "infobox.png", 
                          "path": "/infobox.png", 
                          "size": 8790, 
                          "type": "file"
                        }, 
                        {
                          "date": "2016-10-06T09:51:56.540393", 
                          "name": "Hypertext Transfer Protocol.pdf", 
                          "path": "/Hypertext Transfer Protocol.pdf", 
                          "size": 295893, 
                          "type": "file"
                        }, 
                        {
                          "date": "2016-07-05T15:26:20.412549", 
                          "name": "bar.txt", 
                          "path": "/bar.txt", 
                          "size": 137, 
                          "type": "file"
                        }, 
                        {
                          "date": "2016-10-06T10:03:51.960360", 
                          "name": "foobar.txt", 
                          "path": "/foobar.txt", 
                          "size": 957, 
                          "type": "file"
                        }, 
                        {
                          "date": "2016-09-09T14:46:06.119101", 
                          "name": "foo.pdf", 
                          "path": "/foo.pdf", 
                          "size": 8863, 
                          "type": "file"
                        }
                    ]
                };
            }
        );
    }
    
    function getcontent(filepath) {
        return $http.post('/someapi', { mode: 'getcontent', path: filepath }).then(
            function(response) {
                // Success    
            },
            function() {
                // Error
                // Returning fake data for now
                return {
                    "download_url": "http://localhost:8889/foo.txt", 
                    "preview_url": "http://localhost:8889/preview/9f3cc873982623e10718f688753ecf78475b35fa7e48326aa688fc5ecfc82f2e"
                };
            }
        );
    }
    
};
