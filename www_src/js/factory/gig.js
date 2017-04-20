(function() {
    'use strict';

    angular.module('GigKeeper').factory('Gig', [
        '$resource', 'UrlBuilder',
        function($resource, UrlBuilder) {
            return {
                data: $resource(UrlBuilder.build('/api/v1/gig'), {}, {
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
                        url: UrlBuilder.build('/api/v1/gig/:id')
                    },
                    delete: {
                        action: 'delete',
                        method: 'DELETE',
                        url: UrlBuilder.build('/api/v1/gig/:id')
                    },
                    distance: {
                        action: 'distance',
                        method: 'GET',
                        url: UrlBuilder.build('/api/v1/gig/:id/distance')
                    },
                    distanceTo: {
                        action: 'distanceTo',
                        method: 'GET',
                        url: UrlBuilder.build('/api/v1/gig/distance/:placeId')
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
                                url: UrlBuilder.build('/api/v1/gig')
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