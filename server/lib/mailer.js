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

const path = require("path");
const fs = require("fs");
const Handlebars = require("handlebars");
const HandlebarsIntl = require("handlebars-intl");
HandlebarsIntl.registerWith(Handlebars);
const Promise = require("bluebird");
const config = require("../../config/config.js");

const nodemailer = require("nodemailer");

// configure the transporer from system config
const transporter = nodemailer.createTransport({
    service: config.smtp.service,
    auth: {
        user: config.smtp.user,
        pass: config.smtp.pass
    }
});

// the template base path
const templateBasePath = path.join(__dirname, "../views/email");

/**
 * Load the contents of a named template. The template is resolved
 * by appending the type as the extension and loading it from the
 * base template path.
 * @param {String} templateName base name of template
 * @param {String} type template type extension (html, txt, etc.)
 * @return {Promise<String>} promise of the contents as a string, or null if not found
 */
const getTemplateSource = (templateName, type) => {

    var templatePath = path.join(templateBasePath, templateName + "." + type);

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
const intlData = {
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

module.exports = {

    /**
     * Send an email using the named template and the template context data.
     * @param {Object} mailOptions
     * @param {String} templateName
     * @param {Object} context
     * @return {Promise<Object>}
     */
    sendEmail: (mailOptions, templateName, context) => {

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
        return getTemplateSource(templateName, "txt").then(function(data) {
            textTemplate = data;
            return getTemplateSource(templateName, "html");
        }).then(function(data) {
            htmlTemplate = data;

            // compile the text message from the template, context, and intl data
            if (textTemplate) {
                mailOptions.text = Handlebars.compile(textTemplate)(context, {
                    data: {
                        intl: intlData
                    }
                });
            }

            // compile the html message from the template, context, and intl data
            if (htmlTemplate) {
                mailOptions.html = Handlebars.compile(htmlTemplate)(context, {
                    data: {
                        intl: intlData
                    }
                });
            }

            // reject if no templates were found
            if (!mailOptions.html && mailOptions.text) {
                return Promise.reject(new Error("No text or html templates found for " + templateName));
            } else {

                // send the email!
                return new Promise(function(resolve, reject) {
                    transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(info);
                        }
                    });
                });
            }
        });
    }
};