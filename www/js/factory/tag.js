(function() {
    'use strict';

    angular.module('GigKeeper').factory('Tag', [
        '$resource',
        function($resource) {
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
                        url: '/api/v1/tag/:id'
                    },
                    delete: {
                        action: 'delete',
                        method: 'DELETE',
                        url: '/api/v1/tag/:id'
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
                                url: '/api/v1/tag'
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