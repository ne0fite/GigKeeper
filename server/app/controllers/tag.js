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

"use strict";

const db = require("../../db").sequelize;
const models = db.models;

module.exports = {

    index: async(ctx) => {
        var queryOptions = {
            where: {
                profileId: ctx.state.user.pid
            },
            order: ["name"]
        };

        return models.tag.findAll(queryOptions).then(function(tags) {
            ctx.body = tags;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    get: async(ctx, tagId) => {

        var queryOptions = {
            where: {
                id: tagId,
                profileId: ctx.state.user.pid
            }
        };

        return models.tag.findOne(queryOptions).then(function(tag) {
            if (!tag) {
                ctx.status = 404;
                ctx.body = {
                    message: "Tag Not Found"
                };
            } else {
                ctx.body = tag;
            }
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    create: async(ctx) => {

        var payload = ctx.request.body;

        payload.profileId = ctx.state.user.pid;

        return models.tag.create(payload).then(function(tag) {
            ctx.body = tag;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    update: async(ctx, tagId) => {

        var queryOptions = {
            where: {
                id: tagId,
                profileId: ctx.state.user.pid
            }
        };

        var tag;
        return models.tag.findOne(queryOptions).then(function(result) {
            ctx.body = {};
            if (!result) {
                ctx.status = 404;
                ctx.body.message = "Tag Not Found";
            } else {
                tag = result;
                return tag.update(ctx.request.body);
            }
        }).then(function() {
            ctx.body = tag;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    delete: async(ctx, tagId) => {

        var queryOptions = {
            where: {
                id: tagId,
                profileId: ctx.state.user.pid
            }
        };

        return models.tag.findOne(queryOptions).then(function(tag) {
            ctx.body = {};

            if (!tag) {
                ctx.status = 404;
                ctx.body.message = "Tag Not Found";
            } else {
                return tag.destroy();
            }
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }
};