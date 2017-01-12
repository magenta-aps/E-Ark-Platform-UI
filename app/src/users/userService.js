angular
    .module('eArkPlatform')
    .factory('userService', userService);

function userService($http) {
    return {
        deleteUser: deletePerson,
        getPerson: getPerson,
        createUser: createUser,
        updateUser: updateUser,
        getPersons: getPersons,
        changePassword: changePassword,
        uploadUsersCSVFile: uploadUsersCSVFile
    };

    function deletePerson(userName) {
        return $http.delete('/api/deletePerson?userName=' + userName).then(function (response) {
            return response.data;
        });
    }

    function getPerson(username) {
        return $http.get('/api/getPerson?userName=' + username).then(function (response) {
            return response.data;
        });
    }

    function createUser(userObj) {
        return $http.post('/api/newPerson',
            userObj
        ).then(function (response) {
                return response.data;
            });
    }

    function updateUser(userObj) {
        return $http.put('/api/updatePerson?userName=' + encodeURIComponent(userObj.userName), userObj).then(
            function (response) {
                console.log("Return success");
                return response.data;
            }
        );
    }

    function getPersons(roleType) {
        var url = '/api/people?selectableType=';
        roleType (roleType && roleType.length > 0) ? url += roleType : url+= '*';
        return $http.get(url).then(function (result) {
            return result.data;
        });
    }

    function changePassword(user) {
        //To be implemented
    }

    function uploadUsersCSVFile(file) {
        //To be implemented if needed
    }

}
