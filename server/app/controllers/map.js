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

const AbstractController = require("./abstract");
const place = require("../../lib/place")();
const directions = require("../../lib/directions")();

class MapController extends AbstractController {

    getDistance(ctx, fromPlaceId, toPlaceId, next) {
        return place.distance(fromPlaceId, toPlaceId).asPromise().then(function(result) {
            ctx.body = result.json;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }

    getDirections(ctx, fromPlaceId, toPlaceId, next) {
        return directions.directions(fromPlaceId, toPlaceId).asPromise().then(function(result) {
            ctx.body = result.json;
        }).catch(function(error) {
            ctx.status = 500;
            ctx.body = {
                message: error.message
            };
        });
    }
}

module.exports = MapController;