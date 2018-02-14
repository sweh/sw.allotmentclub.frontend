/*global describe, afterEach, $, gocept, sw, jasmine, beforeEach, it, expect */
/*global getJSONFixture, spyOnEvent, spyOn, HTMLFormElement */
/*jslint nomen: true, unparam: true, bitwise: true*/

describe("sw.allotmentclub.MapView", function () {
    "use strict";

    var view, fixture;

    beforeEach(function () {
        $('body').append($('<div id="main_content"></div>'));
        $('body').append($('<div id="sub_content"></div>'));
        sw.allotmentclub.map.url = '/map';
        sw.allotmentclub.map_download.url = '/map_download';
        view = sw.allotmentclub.map;
        fixture = getJSONFixture('map.json');
        spyOn(HTMLFormElement.prototype, 'submit');
        view.render(fixture.MapView__call__1);
    });

    afterEach(function () {
        $('#main_content').remove();
        $('#sub_content').remove();
    });

    it("renders svg map from content loaded via ajax.", function () {
        expect(
            sw.allotmentclub.map.dom().find('svg').text()
        ).toContain('Grimmling, B.94 (124)');
    });

    it("can download a svg map.", function () {
        sw.allotmentclub.map_download.ajax();
        expect(HTMLFormElement.prototype.submit).toHaveBeenCalled();
        expect(
            $($('form input[name=svg]').val()).text()
        ).toContain('Grimmling, B.94 (124)');
    });

});
