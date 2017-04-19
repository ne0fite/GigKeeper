(function() {
    'use strict';

    angular.module('GigKeeper').factory('Gig', [
        '$resource',
        function($resource) {
            return {
                data: $resource('/api/v1/gig', {}, {
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
                        url: '/api/v1/gig/:id'
                    },
                    delete: {
                        action: 'delete',
                        method: 'DELETE',
                        url: '/api/v1/gig/:id'
                    },
                    distance: {
                        action: 'distance',
                        method: 'GET',
                        url: '/api/v1/gig/:id/distance'
                    },
                    distanceTo: {
                        action: 'distanceTo',
                        method: 'GET',
                        url: '/api/v1/gig/distance/:placeId'
                    }
                }),
                getModel: function() {
                    return kendo.data.Model.define({
                        id: 'id',
                        fields: {
                            name: {
                                type: 'string'
                            },
                            location: {
                                type: 'string'
                            },
                            startDate: {
                                type: 'string'
                            },
                            endDate: {
                                type: 'string'
                            },
                            contractorId: {
                                type: 'string'
                            }
                        }
                    });
                },
                getDataSource: function() {
                    return new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: '/api/v1/gig'
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
                        autoBind: false,
                        dataTextField: 'name',
                        dataValueField: 'id'
                    };
                }
            };
        }
    ]);
}());