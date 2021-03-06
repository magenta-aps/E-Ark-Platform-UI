angular
    .module('eArkPlatform')
    .factory('uploadService', UploadService);

function UploadService($http, notificationUtilsService) {

    var service = {
        uploadFile: uploadFile,
        uploadUsersCSVFile: uploadUsersCSVFile
    };
    return service;

    /**
     * IMPORTANT - Change the url for the ajax post method
     * @param file
     * @param destination
     * @param extras
     * @returns {*}
     */
    function uploadFile(file, destination, extras) {

        var formData = new FormData();
        formData.append("filedata", file);
        formData.append("filename", file.name);
        formData.append("destination", destination ? destination : null);

        if (!extras || !extras.majorVersion) {
            formData.append("majorVersion", "false");
        }

        /**
         * optional fields which may be passed via extras:
         *
         *      siteId
         *      containerId
         *      uploaddirectory
         *      majorVersion
         *      updateNodeRef
         *      description
         *      username
         *      overwrite
         *      thumbnails
         *      username
         */

        if (extras) {
            angular.forEach(extras, function (value, key) {
                formData.append(key, value);
            });
        }

        return $http.post("/api/upload", formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function (response) {
            return response;
        }, function (response) {
            notificationUtilsService.alert(response.data.message);
        });
    }

    function uploadUsersCSVFile(file) {

        var formData = new FormData();
        formData.append("filedata", file);
        formData.append("filename", file.name);
        formData.append("destination", null);

        return $http.post("/api/people/upload.json", formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function (response) {
            return response.data.data;
        });
    }

}