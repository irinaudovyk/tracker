angular
    .module('Tracker', ['ui.router', 'ngResource'])

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $httpProvider.interceptors.push('HttpInterceptor');

        $urlRouterProvider.otherwise("/app/tasks");

        $stateProvider
            .state('app', {
                url: "/app",
                templateUrl: "templates/app.html"
            })
            .state('app.tasks', {
                url: "/tasks",
                templateUrl: "templates/task.html",
                controller: 'TaskCtrl'
            })
            .state('app.task', {
                url: "/tasks/:taskId",
                templateUrl: "templates/task.html",
                controller: 'TaskCtrl'
            })
            .state('app.login', {
                url: "/login",
                controller: "LoginCtrl",
                templateUrl: "templates/login.html"
            })
        ;

    })

    .factory('HttpInterceptor', function ($q, $injector) {
        return {
            'responseError': function (rejection) {
                if (rejection.status == 401) {
                    $injector.get('$state').go('app.login')
                }
                return $q.reject(rejection);
            }
        };
    })

    .factory('Task', function ($resource) {
        return $resource('/api/tasks/:taskId/:nested', {taskId: '@_id'}, {update: {method: 'PUT'}});
    })
    .controller('TaskCtrl', function ($scope, Task, $stateParams) {

        $scope.statuses = [
            "open", "in progress", "done", "accepted"
        ];

        $scope.priorities = [0,1,2,3,4,5,6,7,8,9,10];

        $scope.complexities = [0,1,2,3,4,5,6,7,8,9,10,11];

        var init = function () {

            if ($stateParams.taskId) {
                $scope.task = Task.get({taskId: $stateParams.taskId});
                $scope.tasks = Task.query({taskId: $stateParams.taskId, nested: 'tasks'});
            } else {
                $scope.tasks = Task.query();
            }

            $scope.newTask = new Task({
                simple: true
            });

        };

        init();

        $scope.save = function () {

            if (!$scope.newTask._id) {

                if ($stateParams.taskId) {
                    $scope.newTask.$save({taskId: $stateParams.taskId, nested: 'tasks'}).then(init);
                } else {
                    $scope.newTask.$save().then(init);
                }
            }

            else {
                $scope.newTask.$update().then(init);
            }

        };

        $scope.edit = function (task) {
            $scope.newTask = task;
        };

        $scope.delete = function (task) {
            task.$delete().then(function () {
                init()
            });
        };

    })

    .factory('Login', function ($resource) {
        return $resource('/api/login');
    })
    .controller('LoginCtrl', function ($scope, Login) {

        $scope.login = function () {

            Login.save({
                username: $scope.userName,
                password: $scope.userPassword
            }, function () {
//                console.log('user', user);
                console.log(arguments);
            })

        }

    })


;


