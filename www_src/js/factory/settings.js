(function() {
    'use strict';

    angular.module('GigKeeper').factory('Settings', [
        '$resource', 'UrlBuilder',
        function($resource, UrlBuilder) {
            return {
                data: $resource(UrlBuilder.build('/api/v1/settings'), {}, {
                    index: {
                        action: 'index',
                        method: 'GET'
                    },
                    update: {
                        action: 'update',
                        method: 'POST',
                        url: UrlBuilder.build('/api/v1/settings')
                    }
                })
            };
        }
    ]);
})();
