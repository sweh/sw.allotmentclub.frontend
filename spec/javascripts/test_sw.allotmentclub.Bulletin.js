/*global describe, afterEach, $, gocept, sw, jasmine, beforeEach, it, expect */
/*global getJSONFixture, spyOnEvent, spyOn, HTMLFormElement, window */
/*jslint nomen: true, unparam: true, bitwise: true*/

describe("sw.allotmentclub.Bulletin", function () {
    "use strict";

    var fixture, view;
    window.application_url = '/api';

    beforeEach(function () {
        $('body').append($('<div id="main_content"></div>'));
        $('body').append($('<div id="sub_content"></div>'));
        fixture = getJSONFixture('bulletin.json');
        spyOn($, 'ajax').and.returnValue($.Deferred());
        spyOn($, 'SmartMessageBox');
        spyOn(sw.allotmentclub, "online").and.returnValue(true);
    });

    afterEach(function () {
        $('#main_content').remove();
        $('#sub_content').remove();
    });

    describe("ListView", function () {

        beforeEach(function () {
            view = sw.allotmentclub.bulletin_list_view;
            view.url = fixture.BulletinListView_1.url;
            view.render(fixture.BulletinListView_1.data);
        });

        it("renders bulletins.", function () {
            expect(
                view.dom().find('.dataTables_info').text()
            ).toEqual("1 bis 1 von 1 Einträgen");
            expect(
                view.dom().find('tbody tr td:nth-child(2)').text()
            ).toEqual("Ruhezeiten im Verein");
        });

        it("has an add action.", function () {
            var button = view.dom().find('.actions .btn[href=bulletin_add]');
            expect(button.hasClass('disabled')).toEqual(false);
        });

        it("has an edit action.", function () {
            var button = view.dom().find('.actions .btn[href=bulletin_edit]');
            expect(button.hasClass('disabled')).toEqual(true);
            view.dom().find('tbody tr td').click();
            expect(button.hasClass('disabled')).toEqual(false);
        });
    });

    it("can add bulletins via form.", function () {
        view = sw.allotmentclub.bulletin_add;
        view.url = fixture.BulletinAddView_1.url;
        view.render(fixture.BulletinAddView_1.data);
        view.dom().find('input[name=subject]').val('Vereinsfest findet statt');
        view.dom().find('input[name=subject]').change();
        expect($.ajax).toHaveBeenCalledWith(
            fixture.BulletinEditView_1.data
        );
    });

    it("can delete bulletins.", function () {
        view = sw.allotmentclub.bulletin_delete;
        view.url = fixture.BulletinDeleteView_1.data.url;
        view.render();
        var callback = $.SmartMessageBox.calls.mostRecent().args[1],
            expected = fixture.BulletinDeleteView_1.data;
        callback('Löschen');
        expected.success = jasmine.any(Function);
        expected.error = jasmine.any(Function);
        expect($.ajax).toHaveBeenCalledWith(expected);
    });
});
