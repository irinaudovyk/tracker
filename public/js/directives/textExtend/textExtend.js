angular
    .module('Tracker')
    .directive('textExtend', function () {
        return {
            restrict: 'A',
            templateUrl: 'js/directives/textExtend/textExtend.html',
            controller: function ($scope) {
                $scope.aLimit = $scope.limit || 80;

            },
            scope: {
                text: "=textExtend",
                limit: "=textLimit"
            }
        }
    })
;
