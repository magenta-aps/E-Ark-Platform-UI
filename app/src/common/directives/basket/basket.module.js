angular
    .module('eArkPlatform.common.directives.basket', [ 'ngMaterial', 'pascalprecht.translate'])
    .config(config);
    
function config(languageFilesProvider) {
    languageFilesProvider.addFile('app/src/common/directives/basket/i18n/', '-basket.json');
}