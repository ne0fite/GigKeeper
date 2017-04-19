(function() {
    'use strict';

    angular.module('GigKeeper').factory('Settings', [
        '$resource',
        function($resource) {
            return {
                data: $resource('/api/v1/settings', {}, {
                    index: {
                        action: 'index',
                        method: 'GET'
                    },
                    update: {
                        action: 'update',
                        method: 'POST',
                        url: '/api/v1/settings'
                    }
                })
            };
        }
    ]);
})();
