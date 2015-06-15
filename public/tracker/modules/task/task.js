angular
    .module('Tracker')

    .controller('TaskCtrl', function ($sce,
                                      TaskEditorModal,
                                      $scope,
                                      $state,
                                      $stateParams,
                                      Task,
                                      UserService){

        $scope.report = {
            title: 'Report',
            name: "report"
        };

        $scope.taskId = $stateParams.taskId;

        $scope.init = function () {

            if ($scope.taskId) {

                Task.query({taskId: $scope.taskId, nested: 'tasks'}, function (tasks) {

                    $scope.tasks = tasks;

                    Task.get({taskId: $scope.taskId}, function (task) {
                        $scope.task = task;

                        if (task.parentTaskId) {
                            Task.get({taskId: task.parentTaskId}, function (parentTask) {
                                $scope.parentTask = parentTask;
                            });
                        }
                    });

                }, function () {
                    $state.go('app.tasks');
                });
            } else {
                Task.query(function (tasks) {
                    $scope.tasks = tasks;
                });
            }

            $scope.newTask = new Task({
                simple: true,
                developer: UserService.getUser()._id,
                status: "",
                priority: 5,
                parentTaskId: $scope.taskId || undefined,
                files: [],
                team: []
            });

        };

        var init = $scope.init;

        init();

        $scope.edit = function (task) {

            $scope.newTask = task;

            TaskEditorModal.show(task, init);

        };

    })

    .controller('AssignedTasksCtrl', function ($scope,
                                               TaskEditorModal,
                                               Task,
                                               UserService,
                                               AssignedTasks) {

        $scope.init = function () {
            console.log('init');
            AssignedTasks.query({userId: UserService.getUser()._id}, function (tasks) {
                $scope.assignedTasks = _.map(tasks, function (task) {
                    return new Task(task);
                });
            });
        };

        $scope.$watch('UserService.getUser()._id', function (id) {
            if (id) {
                $scope.init();
            }
        });
    })

    .controller('tagsFindCtrl', function ($scope,
                                          $stateParams,
                                          TaskEditorModal,
                                          Task,
                                          UserService,
                                          TagsFind) {

        var init = function () {
            $scope.tasksByTags = TagsFind.query({taskId: $stateParams.taskId, tags: $stateParams.tags});
        };

        $scope.queryTags = $stateParams.tags;

        $scope.$watch('UserService.getUser()._id', function (id) {
            if (id) {
                init();
            }
        });

        $scope.edit = function (task) {

            Task.get({taskId: task._id}, function (task) {
                TaskEditorModal.show(task, init);
            });

        };

    })

    .controller('gotoRootTaskCtrl', function ($scope,
                                              $stateParams,
                                              RootTask) {


        var getRoot = function () {
            RootTask.get({taskId: $stateParams.taskId}, function (root) {
                $scope.root = root;
            });
        };

        if ($stateParams.taskId) {
            getRoot();
        }


    })

    .controller('SearchCtrl', function ($scope, $stateParams, SearchService) {

        $scope.init = function () {
            SearchService.search($stateParams.query).then(function (tasks) {
                $scope.taskId = SearchService.getTaskId();
                $scope.query = $stateParams.query;
                $scope.tasks = tasks;
            });
        };

        var init = $scope.init;

        init();

    })
;

