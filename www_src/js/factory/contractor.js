(function() {
    'use strict';

    angular.module('GigKeeper').factory('Contractor', [
        '$resource',
        function($resource) {
            return {
                data: $resource('/api/v1/contractor', {}, {
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
                        url: '/api/v1/contractor/:id'
                    },
                    delete: {
                        action: 'delete',
                        method: 'DELETE',
                        url: '/api/v1/contractor/:id'
                    }
                }),
                getModel: function() {
                    return kendo.data.Model.define({
                        id: 'id',
                        fields: {
                            name: {
                                type: 'string'
                            },
                            address1: {
                                type: 'string'
                            },
                            address2: {
                                type: 'string'
                            },
                            city: {
                                type: 'string'
                            },
                            region: {
                                type: 'string'
                            },
                            postalCode: {
                                type: 'string'
                            },
                            phone: {
                                type: 'string'
                            },
                            email: {
                                type: 'string'
                            },
                            web: {
                                type: 'string'
                            }
                        }
                    });
                },
                getDataSource: function() {
                    return new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: '/api/v1/contractor'
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
                        dataValueField: 'id',
                        valuePrimitive: true
                    };
                }
            };
        }
    ]);
}());