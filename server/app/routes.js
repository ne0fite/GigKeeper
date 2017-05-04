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

const route = require("koa-route");
const jwt = require("koa-jwt");
const config = require("../../config/config.js");

const routes = module.exports;

routes.register = (app) => {

    // secure all routes except security and registration
    app.use(jwt({ secret: config.api.jwt.secret }).unless({ path: [/^\/api\/v1\/security/, /^\/api\/v1\/register/] }));

    // security routes
    app.use(route.post("/api/v1/security/login", app.controllers.security.loginAction));
    app.use(route.post("/api/v1/security/logout", app.controllers.security.logoutAction));
    app.use(route.post("/api/v1/security/requestPasswordReset", app.controllers.security.requestPasswordResetAction));
    app.use(route.post("/api/v1/security/resetPassword", app.controllers.security.resetPasswordAction));

    // contractor routes
    app.use(route.get("/api/v1/contractor", app.controllers.contractor.index));
    app.use(route.get("/api/v1/contractor/export", app.controllers.contractor.export));
    app.use(route.get("/api/v1/contractor/:id", app.controllers.contractor.get));
    app.use(route.post("/api/v1/contractor", app.controllers.contractor.create));
    app.use(route.post("/api/v1/contractor/:id", app.controllers.contractor.update));
    app.use(route.delete("/api/v1/contractor/:id", app.controllers.contractor.delete));

    // gig routes
    app.use(route.get("/api/v1/gig", app.controllers.gig.index));
    app.use(route.get("/api/v1/gig/descriptions", app.controllers.gig.getGigDescriptions));
    app.use(route.get("/api/v1/gig/export", app.controllers.gig.export));
    app.use(route.get("/api/v1/gig/:id", app.controllers.gig.get));
    app.use(route.post("/api/v1/gig", app.controllers.gig.create));
    app.use(route.post("/api/v1/gig/:id", app.controllers.gig.update));
    app.use(route.delete("/api/v1/gig/:id", app.controllers.gig.delete));
    app.use(route.get("/api/v1/gig/:id/distance", app.controllers.gig.getGigDistance));

    // map routes
    app.use(route.get("/api/v1/map/distance/:fromPlaceId/:toPlaceId", app.controllers.map.getDistance));
    app.use(route.get("/api/v1/map/directions/:fromPlaceId/:toPlaceId", app.controllers.map.getDirections));

    // invitation routes
    app.use(route.get("/api/v1/profile/invite", app.controllers.registration.inviteIndex));
    app.use(route.post("/api/v1/profile/invite", app.controllers.registration.sendInvite));
        
    // registration routes
    app.use(route.get("/api/v1/register/invite/:code", app.controllers.registration.getInvite));
    app.use(route.post("/api/v1/register/invite/:code", app.controllers.registration.registerInvite));

    // settings routes
    app.use(route.get("/api/v1/settings", app.controllers.settings.get));
    app.use(route.post("/api/v1/settings", app.controllers.settings.save));

    // tag routes
    app.use(route.get("/api/v1/tag", app.controllers.tag.index));
    app.use(route.get("/api/v1/tag/:id", app.controllers.tag.get));
    app.use(route.post("/api/v1/tag", app.controllers.tag.create));
    app.use(route.post("/api/v1/tag/:id", app.controllers.tag.update));
    app.use(route.delete("/api/v1/tag/:id", app.controllers.tag.delete));

    // user profile routes
    app.use(route.get("/api/v1/user/profile", app.controllers.user.getProfileAction));
    app.use(route.post("/api/v1/user/profile", app.controllers.user.saveProfileAction));
    app.use(route.post("/api/v1/user/invite", app.controllers.user.inviteAction));
};