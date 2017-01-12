angular
    .module('eArkPlatform.init', ['ngMaterial'])
    .constant('USER_ROLES', {
        archivist: 'archivist',
        enduser: 'enduser'
        //guest: 'guest' we don't want this type of user as of yet
    })
    .constant('ALFRESCO_URI', {
        apiProxy: '/alfresco/api/',
        serviceApiProxy: '/api/',
        serviceSlingshotProxy: '/slingshot/',
        webClientServiceProxy: '/alfresco/service'
    })
    .constant('AUTH_HOST_URI',{
        serviceProxy:'/eark/authService'
    })
    .constant('AIP_REPOSITORY_URI',{
        serviceProxy:'/aip/repo/search'
    })
    .constant('OMS_URI',{
        serviceProxy:'/oms'
    })
    .constant('PATTERNS', {
        fileName: /^[a-zA-Z0-9_\-,!@#$%^&()=+ ]+$/,
        phone: /^[+]?[0-9\- ]+$/
    })
    .constant('APP_CONFIG', {
        appName: 'E-Ark search/order tools',
        logoSrc: './app/assets/images/logo.gif'
    });