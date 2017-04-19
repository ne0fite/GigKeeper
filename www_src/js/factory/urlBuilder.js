(function() {
    'use strict';

    angular.module('GigKeeper').factory('UrlBuilder', [
        function() {
            return {
                build: function (relativeUrl) {
                    var apiConfig = window.appConfig.api;

                    return 'http://' + apiConfig.host + ':' + apiConfig.port + relativeUrl;
                }
            };
        }
    ]);
}());