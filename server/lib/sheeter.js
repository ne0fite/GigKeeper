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

var XLSX = require("xlsx");

/**
 * This service encapsulates spreadsheet generation functionality. Sorry for the sheety jokes.
 * Some parts are loosely based on this demo: http://sheetjs.com/demos/writexlsx.html
 * 
 * @return {function}
 */
module.exports = function() {
    var model = {};
    
    /**
     * Converts a date string to a numeric Excel date.
     * 
     * @param {string} date A date string that Date knows how to handle
     * 
     * @return {number} The date's numeric representation in Excel
     */
    function dateToExcel(date) {
        var epoch = Date.parse(date);
        
        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
    }

    /**
     * Turn an array full of data into an object that conforms to the js-xlsx input spec.
     * https://github.com/SheetJS/js-xlsx
     * 
     * @param {array} data 
     * 
     * @return {object} A sheet object
     */
    function arrayToSheet(data) {
        var sheet = {};
        var i, j, row, cell;
        
        //the range object contains the spreadsheet's dimensions (TBD)
        var range = {
            s: {
                c: 10000000,
                r: 10000000
            },
            e: {
                c: 0,
                r: 0
            }
        };

        for(i = 0; i != data.length; ++i) {
            if(typeof data[i] == "undefined") {
                continue;
            }

            row = data[i];
            for(j = 0; j != row.length; ++j) {
                //update the range
                range.s.r = range.s.r > i ? i : range.s.r;
                range.s.c = range.s.c > j ? j : range.s.c;
                range.e.r = range.e.r < i ? i : range.e.r;
                range.e.c = range.e.c < j ? j : range.e.c;
                
                cell = {
                    t: "s",     //type (default to string)
                    v: row[j]   //value
                };

                if(cell.v === null) {
                    continue;
                }

                //determine the cell's type, and encode it if necessary
                if(typeof cell.v === "number") {
                    cell.t = "n";
                }
                else if(typeof cell.v === "boolean") {
                    cell.t = "b";
                }
                else if(cell.v instanceof Date) {
                    cell.t = "n";
                    cell.z = XLSX.SSF._table[14];
                    cell.v = dateToExcel(cell.v);
                }

                row[j] = cell;
            }
        }
        
        if(range.s.c < 10000000) {
            sheet["!ref"] = XLSX.utils.encode_range(range);
        }

        return sheet;
    }

    /**
     * Generate an XLSX document from the provided array. Requires that all objects in the array have the same keys and
     * length. The sheets should conform to this structure:
     * 
     * [
     *     {
     *         name: "Your Sheet Name",
     *         data: [
     *             {}   //row data as key/value pairs goes here
     *         ]
     *     }
     * ]
     * 
     * @param {object[]} sheets The data to put into the spreadsheet
     * 
     * @return {object} The workbook
     */
    model.toXLSX = function (sheets) {
        if(!sheets.length) {
            throw new Error("There is no data to export.");
        }

        var workbook = {
            SheetNames: [],
            Sheets: []
        };

        sheets.forEach(function (freshSheet) {
            var headings = Object.keys(freshSheet.data[0]);
            var preparedData = freshSheet.data.map(function (row) {
                return Object.keys(row).map(function (key) {
                    return row[key];
                });
            });
            preparedData.unshift(headings);
            var sheet = arrayToSheet(preparedData);

            workbook.SheetNames.push(freshSheet.name);
            workbook.Sheets.push(sheet);
        });

        return XLSX.write(workbook, {
            bookType: "xlsx",
            bookSST: true,
            type: "binary"
        });
    };

    return model;
};