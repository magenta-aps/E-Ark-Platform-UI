
    angular
        .module('openDeskApp')
        .factory('searchService', searchService);

    function searchService($http, AIP_REPOSITORY_URI) {

        var service = {};

        service.aipSearch = function(term){
            return $http.get(AIP_REPOSITORY_URI.serviceProxy +'/select?'+ term).then(function(response){
                //debugger;
                return response.data.response;
            })
        };

        service.findPersons = function (searchTerm) {
            var url = ALFRESCO_URI + '/people';
            if(searchTerm && searchTerm.length > 0){
                url += searchTerm;
            }
            url +="?sortBy=lastName&dir=asc&filter=*&maxResults=250";

            return $http.get(url).then(function(result){
                return result.data.people;
            });
        };

        return service;
    }