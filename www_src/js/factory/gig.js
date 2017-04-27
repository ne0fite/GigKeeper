/**
 * @license
 * Copyright (C) 2017 Phoenix Bright Software, LLC
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
                read: {
                    action: 'read',
                    method: 'GET',
                    url: UrlBuilder.build('/api/v1/gig/:id')
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