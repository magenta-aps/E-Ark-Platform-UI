angular
    .module('eArkPlatform')
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

    /**
     * summary:
     *        takes a name/value mapping object and returns a string representing
     *        a URL-encoded version of that object.
     * example:
     *        this object:
     *    {
     *		blah: "blah",
     *		multi: [
     *			"thud",
     *			"thonk"
     *	    ]
     *	};
     *
     *    yields the following query string: "blah=blah&multi=thud&multi=thonk"
     *
     * credit to alfresco Aikau developers.
     * @param map
     * @returns {string}
     */
    service.objectToQueryString = function(map) {
        // FIXME: need to implement encodeAscii!!
        var enc = encodeURIComponent, pairs = [];
        for (var name in map) {
            var value = map[name];
            var assign = enc(name) + "=";
            if (Array.isArray(value)) {
                for (var i = 0, l = value.length; i < l; ++i) {
                    pairs.push(assign + enc(value[i]));
                }
            } else {
                pairs.push(assign + enc(value));
            }
        }
        return pairs.join("&"); // String
    };

    return service;
}