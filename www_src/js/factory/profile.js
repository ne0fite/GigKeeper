(function() {
    'use strict';

    angular.module('GigKeeper').factory('Profile', [
        '$resource', 'UrlBuilder',
        function($resource, UrlBuilder) {
            return {
                data: $resource(UrlBuilder.build('/api/v1/user/profile'), {}, {
                    index: {
                        action: 'index',
                        method: 'GET'
                    },
                    update: {
                        action: 'update',
                        method: 'POST'
                    }
                })
            };
        }]);
})();