/*global describe, document, $, gocept, sw, jasmine, beforeEach, it, expect */
/*global waits, runs, waitsFor, afterEach, spyOn, Handlebars, localStorage */
/*jslint nomen: true, unparam: true, bitwise: true*/

describe("sw.allotmentclub.DeleteView", function () {
    "use strict";

    var view;

    beforeEach(function () {
        $('body').append($('<div id="main_content"></div>'));
        $('body').append($('<div id="sub_content"></div>'));
        view = new sw.allotmentclub.DeleteView('my_view');
        view.url = '/api/mail/1/delete';
        spyOn(sw.allotmentclub.DeleteView.prototype, 'ajax');
        spyOn($, 'SmartMessageBox');
    });

    afterEach(function () {
        $('#main_content').remove();
        $('#sub_content').remove();
    });

    it("asks for confirmation before calling render.", function () {
        view.render();
        expect(sw.allotmentclub.DeleteView.prototype.ajax).not.toHaveBeenCalled();
        expect($.SmartMessageBox).toHaveBeenCalledWith(
            {
                title: 'Bestätigung erforderlich',
                content: 'Sind Sie sicher, dass Sie das ausgewählte Element löschen wollen?',
                buttons: '[Abbrechen][Löschen]'
            },
            jasmine.any(Function)
        );
    });

    it(
        "does not call render if confirmation was not acknowledged.",
        function () {
            view.render();
            expect($.SmartMessageBox).toHaveBeenCalled();
            var callback = $.SmartMessageBox.calls.mostRecent().args[1];
            callback('Abbrechen');
            expect(sw.allotmentclub.DeleteView.prototype.ajax).not.toHaveBeenCalled();
        }
    );

    it("calls render if confirmation was acknowledged.", function () {
        view.render();
        expect($.SmartMessageBox).toHaveBeenCalled();
        var callback = $.SmartMessageBox.calls.mostRecent().args[1];
        expect(sw.allotmentclub.DeleteView.prototype.ajax).not.toHaveBeenCalled();
        callback('Löschen');
        expect(sw.allotmentclub.DeleteView.prototype.ajax).toHaveBeenCalledWith(
            '/api/mail/1/delete',
            null,
            jasmine.any(Function)
        );
    });
});
