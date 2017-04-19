(function() {
    'use strict';
    angular.module('GigKeeper').controller('alert', [
        '$scope',
        function($scope) {
        	$scope.closeAlert = function (index) {
        		$scope.alerts.splice(index, 1);
        	};
        }
    ]);
}());