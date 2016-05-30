angular
    .module('eArkPlatform.search')
    .controller('SearchController', SearchController);

/**
 * Main Controller for the Search module
 * @param $scope
 * @constructor
 */
function SearchController($scope, $stateParams, searchService, fileUtilsService) {
    var sctrl = this;
    sctrl.searchTerm = $stateParams.searchTerm;
    sctrl.selectedFilters = {}; //Keep track of the selected filters
    sctrl.filtersQueryString = ""; // the selected filters as query string
    //sctrl.definedFacets = searchService.getConfiguredFacets();
    sctrl.layout = 'list';

    executeAipSearch('content', sctrl.searchTerm);


    /**
     * Executes the main search function to search for cases and case documents in the repository
     * @param context - The context with which to search
     * @param term - The query term
     */
    function executeAipSearch(context, term) {
        var queryObj = {
            q: context + ':' + term,
            rows: 25,
            start: 0,
            wt: "json"
        };
        var objQuerified = searchService.objectToQueryString(queryObj);
        getAipSearchQuery(objQuerified);
    }

    function formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Byte';
        var k = 1000;
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function getAipSearchQuery(query) {

        searchService.aipSearch(query).then(function (response) {
            sctrl.queryResult = response.docs;
            //debugger;
            if (response.numFound > 0) {
                sctrl.fullSearchResults = {
                    results: sctrl.queryResult, //An array of objects
                    numberFound: response.numFound
                };

                //Let's clean up some of the properties. Temporary solution
                sctrl.fullSearchResults.results.forEach(function (item) {
                    item.title = item.path.substring(item.path.lastIndexOf('/') + 1, item.path.lastIndexOf('.'));
                    item.packageId = item.package.substring(item.package.indexOf('_') + 1);
                    item.thumbnail = fileUtilsService.getFileIconByMimetype(item.contentType, 24)
                    item.displaySize = formatBytes(item.size);
                });
            }
        });
    }

    function getSearchQuery(query) {

        searchService.search(query).then(function (response) {
            sctrl.queryResult = response;
            if (response.numberFound > 0) {
                sctrl.fullSearchResults = {
                    results: response.items, //An array of objects
                    facets: response.facets,//An array of objects
                    totalRecords: response.totalRecords, //Rest of these are integer values
                    totalRecordsUpper: response.totalRecordsUpper,
                    numberFound: response.numberFound
                };
                setActiveFacets();
                // console.log("Facets: ", sctrl.fullSearchResults.facets)
            }
        });
    }

    function setActiveFacets() {
        // If object is empty
        if (Object.getOwnPropertyNames(sctrl.selectedFilters).length == 0) return;

        angular.forEach(sctrl.selectedFilters, function (value, key) {
            var facet = sctrl.fullSearchResults.facets[key];
            angular.forEach(facet, function (facetObject) {
                if (facetObject.value === value) facetObject.selected = true;
            })
        })
    }


    /**
     * Extracts the QName from each defined facet and 'stringifies' them for the query object
     * @returns {string}
     */
    function parseFacetsForQueryFilter() {
        var stringFacet = "";
        sctrl.definedFacets.forEach(function (item) {
            stringFacet == "" ? stringFacet += item.facetQName : stringFacet = stringFacet + ',' + item.facetQName
        });
        return stringFacet;
    }

    sctrl.filterResults = function (filterKey, filterValue) {
        //console.log("The filter value : "+ filterKey +" ==> "+filterValue);
        //selectedFilters is to be used to track what is checked then on every addition or removal, we rebuild the
        //filter query string and re-execute the search
        if (sctrl.selectedFilters[filterKey])
            delete (sctrl.selectedFilters[filterKey]);
        else
            sctrl.selectedFilters[filterKey] = filterValue;

        rebuildFilterQueryString();
    };

    function rebuildFilterQueryString() {
        //console.log("Rebuilding filter Query string");
        var filterQueryStringArr = [];
        Object.keys(sctrl.selectedFilters).forEach(function (key) {
            var bufStr = "";
            var value = sctrl.selectedFilters[key];
            //strip the @ at the start of the string just in case
            if (key.startsWith("@"))
                bufStr = key.substring(1) + "|" + value;
            else
                bufStr = key + "|" + value;

            filterQueryStringArr.push(bufStr);
        });

        sctrl.filtersQueryString = filterQueryStringArr.toString();
        executeSearch();
    }

}