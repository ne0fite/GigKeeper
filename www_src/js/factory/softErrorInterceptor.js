(function() {
    'use strict';

    angular.module('GigKeeper').factory('SoftErrorInterceptor', [
        '$rootScope', '$q',
        function($rootScope, $q) {
            return {
                response: function (response) {
                    return response;
                },
                
                responseError: function(response) {
                    if(typeof $rootScope.alerts == 'undefined') {
                        $rootScope.alerts = [];
                    }

                    $rootScope.alerts.push({
                        type: 'danger',
                        msg: response.data.message
                    });

                    return $q.reject(response);
                }
            };
        }
    ]);
})();