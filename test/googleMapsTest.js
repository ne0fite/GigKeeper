"use strict";

var Lab = require("lab");
var lab = exports.lab = Lab.script();
var _ = require("lodash");
var Code = require("code");
var GoogleMaps = require("../server/lib/googlemaps.js");

lab.experiment("Google Maps Library", function () {

    var maps = new GoogleMaps("AIzaSyBNbgD_hQFLD93gpL9dQcrz7-s91vxl-H8");

    lab.test("Get Distance", function (done) {
        var origin = {
            place_id: "Ei81MzggT2FrIFJpZGdlIFRyYWlscyBDdCwgQmFsbHdpbiwgTU8gNjMwMjEsIFVTQQ"
        };
        var destination = {
            place_id: "ChIJSWAZmRiz2IcR8D-6M0jzYho"
        };
        maps.getDistance(origin, destination).then(function(result) {

            Code.expect(result.rows).to.not.be.undefined();
            Code.expect(result.rows.length).to.be.above(0);
            Code.expect(result.rows[0].elements).to.not.be.undefined();
            Code.expect(result.rows[0].elements.length).to.be.above(0);
            
            var element = result.rows[0].elements[0];
            Code.expect(element.distance.value).to.equal(40674);
            Code.expect(element.duration.value).to.equal(2186);
            Code.expect(element.status).to.equal("OK");

            done();
        }).catch(function(error) {
            done(error);
        });
    });
});