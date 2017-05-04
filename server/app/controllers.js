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

const ContractorController = require("./controllers/contractor");
const GigController = require("./controllers/gig");
const MapController = require("./controllers/map");
const RegistrationController = require("./controllers/registration");
const SecurityController = require("./controllers/security");
const SettingsController = require("./controllers/settings");
const TagController = require("./controllers/tag");
const UserController = require("./controllers/user");

const controllers = module.exports;

controllers.contractor = new ContractorController();
controllers.gig = new GigController();
controllers.map = new MapController();
controllers.registration = new RegistrationController();
controllers.security = new SecurityController();
controllers.settings = new SettingsController();
controllers.tag = new TagController();
controllers.user = new UserController();