angular
    .module('eArkPlatform.header')
    .provider('modulesMenuService', modulesMenuServiceProvider);

function modulesMenuServiceProvider() {
    var items = [];
    var extUserItems = [];
    this.addItem = addItem;
    this.$get = modulesMenuService;

    function addItem(item) {
        items.push(item);
        return this;
    }

    function modulesMenuService(sessionService) {
        return {
            getItems: getItems
        };

        function getItems() {
            return items;
        }
    }
}