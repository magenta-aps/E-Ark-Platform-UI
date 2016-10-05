angular
    .module('eArkPlatform.header', ['ngMaterial'])
    .config(config);
    
function config(languageFilesProvider) {
    languageFilesProvider.addFile('app/src/header/i18n/', '-header.json');
}
