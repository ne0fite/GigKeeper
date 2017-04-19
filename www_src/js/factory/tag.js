(function() {
    'use strict';

    angular.module('GigKeeper').factory('Tag', [
        '$resource', 'UrlBuilder',
        function($resource, UrlBuilder) {
            return {
                data: $resource('/api/v1/tag', {}, {
                    index: {
                        action: 'index',
                        method: 'GET',
                        isArray: true
                    },
                    create: {
                        action: 'create',
                        method: 'POST'
                    },
                    update: {
                        action: 'update',
                        method: 'POST',
                        url: UrlBuilder.build('/api/v1/tag/:id')
                    },
                    delete: {
                        action: 'delete',
                        method: 'DELETE',
                        url: UrlBuilder.build('/api/v1/tag/:id')
                    }
                }),
                getModel: function() {
                    return kendo.data.Model.define({
                        id: 'id',
                        fields: {
                            name: {
                                type: 'string'
                            },
                            description: {
                                type: 'string'
                            }
                        }
                    });
                },
                getDataSource: function() {
                    return new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: UrlBuilder.build('/api/v1/tag')
                            }
                        },
                        schema: {
                            model: this.getModel()
                        }
                    });
                },
                getDropdownOptions: function() {
                    return {
                        dataSource: this.getDataSource(),
                        autoBind: true,
                        dataTextField: 'name',
                        dataValueField: 'id'
                    };
                }
            };
        }
    ]);
}());