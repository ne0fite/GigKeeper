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

const place = require("../../lib/place")();
const db = require("../../db").sequelize;
const models = db.models;

module.exports = {

    get: async(ctx) => {
        var queryOptions = {
            where: {
                id: ctx.state.user.pid
            }
        };

        return models.profile.findOne(queryOptions).then(function(profile) {
            if (profile) {
                ctx.body = profile;
            } else {
                ctx.status = 403;
                ctx.body = {
                    message: "Invalid Session"
                };
            }
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    },

    save: async(ctx) => {

        var updatedProfile = Object.assign({}, ctx.request.body);

        updatedProfile.homeBasePlace = place.stripPlace(ctx.request.body.homeBasePlace);

        var queryOptions = {
            where: {
                id: ctx.state.user.pid
            }
        };

        return models.profile.findOne(queryOptions).then(function(profile) {

            if (profile) {
                return profile.update(updatedProfile);
            } else {
                throw new Error("Invalid Session");
            }
        }).then(function(profile) {
            ctx.body = profile;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }
};