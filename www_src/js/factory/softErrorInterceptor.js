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
                    if(response.status == 401) {
                        return response;        //it is redundant to display a message for a 401
                    }

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