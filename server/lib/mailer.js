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

var path = require("path");
var fs = require("fs");
var Handlebars = require("handlebars");
var HandlebarsIntl = require("handlebars-intl");
HandlebarsIntl.registerWith(Handlebars);
var Promise = require("bluebird");
var config = require("../../config/config.js");

var nodemailer = require("nodemailer");

module.exports = Mailer;

function Mailer() {

    // configure the transporer from system config
    this.transporter = nodemailer.createTransport({
        service: config.smtp.service,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.pass
        }
    });

    // the template base path
    this.templateBasePath = path.join(__dirname, "../views/email");

    /**
     * Load the contents of a named template. The template is resolved
     * by appending the type as the extension and loading it from the
     * base template path.
     * @param {String} templateName base name of template
     * @param {String} type template type extension (html, txt, etc.)
     * @return {Promise<String>} promise of the contents as a string, or null if not found
     */
    this.getTemplateSource = function(templateName, type) {
        var self = this;

        var templatePath = path.join(self.templateBasePath, templateName + "." + type);

        return new Promise(function(resolve, reject) {

            fs.readFile(templatePath, { encoding: "utf8" }, function(err, data) {
                if (err) {
                    if (err.code == "ENOENT") {
                        // simply return null if not found
                        resolve(null);
                    } else {
                        reject(err);
                    }
                } else {
                    resolve(data);
                }
            });
        });
    };

    // intl data for rendering handlebar templates
    this.intlData = {
        locales: "en-US",
        formats: {
            date: {
                short: {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            },
            time: {
                hhmm: {
                    hour: "numeric",
                    minute: "numeric"
                }
            },
            relative: {
                hours: {
                    units: "hour",
                    style: "numeric"
                }
            }
        }
    };
}

/**
 * Send an email using the named template and the template context data.
 * @param {Object} mailOptions
 * @param {String} templateName
 * @param {Object} context
 * @return {Promise<Object>}
 */
Mailer.prototype.sendEmail = function(mailOptions, templateName, context) {
    var self = this;

    // return if not enabled
    if (!config.smtp.enabled) {
        return Promise.resolve({
            accepted: mailOptions.to
        });
    }

    // override recipient address(es) if config'd to send to a single address
    if (config.smtp.singleAddress) {
        mailOptions.to = config.smtp.singleAddress;
    }

    // add baseUrl to the context
    context.baseUrl = config.app.baseUrl;

    // load / compile / render the templates
    var textTemplate;
    var htmlTemplate;
    return self.getTemplateSource(templateName, "txt").then(function(data) {
        textTemplate = data;
        return self.getTemplateSource(templateName, "html");
    }).then(function(data) {
        htmlTemplate = data;

        // compile the text message from the template, context, and intl data
        if (textTemplate) {
            mailOptions.text = Handlebars.compile(textTemplate)(context, {
                data: {
                    intl: self.intlData
                }
            });
        }

        // compile the html message from the template, context, and intl data
        if (htmlTemplate) {
            mailOptions.html = Handlebars.compile(htmlTemplate)(context, {
                data: {
                    intl: self.intlData
                }
            });
        }

        // reject if no templates were found
        if (!mailOptions.html && mailOptions.text) {
            return Promise.reject(new Error("No text or html templates found for " + templateName));
        } else {

            // send the email!
            return new Promise(function(resolve, reject) {
                self.transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                });
            });
        }
    });
};