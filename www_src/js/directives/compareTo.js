(function() {
    'use strict';

    angular.module('GigKeeper').directive('gkCompareTo', function() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=gkCompareTo'
            },
            link: function($scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == $scope.otherModelValue;
                };

                $scope.$watch('otherModelValue', function() {
                    ngModel.$validate();
                });
            }
        };
    });
})();