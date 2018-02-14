/*global describe, document, $, gocept, sw, jasmine, beforeEach, it, expect */
/*global waits, runs, waitsFor, afterEach, spyOn, Handlebars, Dropzone */
/*jslint nomen: true, unparam: true, bitwise: true*/

describe("sw.allotmentclub.UploadForm", function () {
    "use strict";

    var view;

    beforeEach(function () {
        $('body').append($('<div id="main_content"></div>'));
        $('body').append($('<div id="sub_content"></div>'));
        view = new sw.allotmentclub.UploadForm('my_view');
        view.url = '/api/mail/1/upload';
        spyOn(sw.allotmentclub.UploadForm.prototype, 'success_callback');
        spyOn($, 'SmartMessageBox');
    });

    afterEach(function () {
        $('#main_content').remove();
        $('#sub_content').remove();
    });

    it("creates a DropZone on initialization.", function () {
        view.render({status: 'success', data: {}});
        expect($('#uploadform').length).toEqual(1);
        var dropzone = Dropzone.forElement("#uploadform");
        expect(dropzone.options.url).toEqual('/api/mail/1/upload');
        expect(dropzone.options.acceptedFiles).toEqual(null);
    });

    it("can upload a file.", function () {
        view.render({status: 'success', data: {}});
        var dropzone = Dropzone.forElement("#uploadform"),
            file = { name: 'file.pdf', size: 12345 };

        dropzone.emit("success", file);
        expect(
            sw.allotmentclub.UploadForm.prototype.success_callback
        ).toHaveBeenCalledWith();
    });
});
