angular
    .module('eArkPlatform')
    .factory('contextService', contextService);

function contextService($window, sessionService) {
    var platformAppContext = {
        browse : "",
        user : "endUser"
    };
    var service = {
        clearContext : clearContext,
        setUserContext : setUserContext,
        setBrowseContext : setBrowseContext,
        getUserContext : getUserContext,
        getBrowseContext : getBrowseContext
    };

    init();

    return service;

    /**
     * Initialise the contextObject
     */
    function init() {
        $window.localStorage.setItem('platformAppContext', angular.toJson(platformAppContext)) ;
    }

    /**
     * Clear the entire context object
     */
    function clearContext(){
        platformAppContext = {};
        $window.localStorage.clear('platformAppContext');
    }

    /**
     * Sets the user context to the role of the user in session
     */
    function setUserContext( ){
        platformAppContext.user = _getUserRole();
        _reInitialiseContext()
    }

    /**
     * Sets the browsing context (so that we can browse in the right place in the IP viewer)
     * @param value
     */
    function setBrowseContext(value){
        platformAppContext.browse = value;
        _reInitialiseContext()
    }

    /**
     * Gets the user context
     * @returns {string}
     */
    function getUserContext(){
        return platformAppContext.user;
    }

    /**
     * Gets the browse context
     * @returns {string}
     */
    function getBrowseContext(){
        return platformAppContext.browse;
    }

    /**
     * Used to re-initialise the context object. Should be called after modifying a value in the context object
     * @private
     */
    function _reInitialiseContext(){
        $window.localStorage.setItem('platformAppContext', angular.toJson(platformAppContext));
    }

    /**
     * Gets the user role from the session
     * @returns {*}
     * @private
     */
    function _getUserRole(){
        return sessionService.getUserInfo().user.role;
    }

}