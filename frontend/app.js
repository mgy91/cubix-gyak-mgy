angular.module('cubixApp', [])
.controller('TaskController', function($scope, $http) {
    $scope.tasks = [];

    // Adatok lekérése az API-tól
    $scope.loadTasks = function() {
        $http.get('/api/tasks').then(function(response) {
            $scope.tasks = response.data;
        });
    };

    // Új adat küldése (POST) a JSON Servernek
    $scope.addTask = function() {
        if (!$scope.newTask) return;
        $http.post('/api/tasks', { title: $scope.newTask, status: 'Új' }).then(function() {
            $scope.newTask = '';
            $scope.loadTasks();
        });
    };

    $scope.loadTasks();
});
