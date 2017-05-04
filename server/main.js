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

const koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const logger = require("koa-logger");
const compress = require("koa-compress");
const json = require("koa-json");

const app = module.exports = new koa();
app.config = require("../config/config.js");
app.unless = require("koa-unless");

app.use(cors({
    origin: app.config.app.baseUrl,
    exposeHeaders: [ "Content-Disposition" ]
}));

app.use(bodyParser());
app.routes = require("./app/routes");
app.controllers = require("./app/controllers");

//initialize middleware
app.use(logger());
app.use(json({ pretty: false }));

//compress responses with gzip
app.use(compress({
    filter: function(contentType) {
        return /text/i.test(contentType);
    },
    threshold: 2048,
    flush: require("zlib").Z_SYNC_FLUSH
}));

//add x-response-time header
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
});

app.routes.register(app);

//start the server
if (!module.parent) {
    console.log("GigKeeper API server running on port " + app.config.api.port); // eslint-disable-line no-console
    app.listen(app.config.api.port);
}