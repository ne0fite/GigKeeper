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

angular.module('GigKeeper').factory('Tag', [
    '$resource', 'localStorageService', '$uibModal', 'UrlBuilder',
    function($resource, localStorageService, $uibModal, UrlBuilder) {
        return {
            data: $resource(UrlBuilder.build('/api/v1/tag'), {}, {
                index: {
                    action: 'index',
                    method: 'GET'
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
                            url: UrlBuilder.build('/api/v1/tag'),
                            beforeSend: function(req) {
                                var apiToken = localStorageService.get('apiToken');
                                if (apiToken) {
                                    req.setRequestHeader('Authorization', 'Bearer ' + apiToken);
                                }
                            }
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
            },

            /**
             * Open the tag editor modal.
             * 
             * @param  {object} [tag] The tag to edit
             * 
             * @return {object} The modal's promise
             */
            editDialog: function (tag) {
                var modalInstance = $uibModal.open({
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: '/template/dialogs/tagEdit.html',
                    controller: 'TagEditController as vm',
                    resolve: {
                        tag: function() {
                            return tag;
                        }
                    }
                });

                return modalInstance.result;
            }
        };
    }
]);