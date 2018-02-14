/*global describe, document, $, ajja, sw, jasmine, beforeEach, it, expect */
/*global waits, runs, waitsFor, afterEach, spyOn, Handlebars, localStorage */
/*jslint nomen: true, unparam: true, bitwise: true*/

describe("sw.allotmentclub.AddJSFormView", function () {
    "use strict";

    var view;

    beforeEach(function () {
        $('body').append($('<div id="main_content"></div>'));
        $('body').append($('<div id="sub_content"></div>'));
        view = new sw.allotmentclub.AddJSFormView('my_view');
        view.url = '/api/mail/';
        spyOn(ajja.Form.prototype, 'save');
        spyOn($, 'ajax').and.returnValue($.Deferred());
        spyOn(
            sw.allotmentclub.DisplayListWidget.prototype,
            '__init__'
        ).and.callThrough();

        view.render({
            "url": "/api/mail/20/edit",
            "load_data": {
                "member_id": null,
                "subject": null,
                "body": null,
                "attachments": [],
                "day": "08.02.2016 15:50"
            },
            "load_options": {
                "body": {"template": "form_markdown", "label": "Nachricht"},
                "member_id": {
                    "source": [
                        {"token": 187, "title": "Alle Mitglieder"},
                        {"token": 145, "title": "Ackermann, Dagmar (321)"},
                        {"token": 160, "title": "Albrecht, Brigitte (407)"}
                    ],
                    "label": "Empf\u00e4nger",
                    "css_class": "chosen"
                },
                "attachments": {
                    "label": "Anh\u00e4nge",
                    "template": "form_upload",
                    "documents_collection_url": "/api/mail/20/attachments"
                },
                "subject": {"label": "Betreff"},
                "day": {"css_class": "datetimepicker", "label": "Tag"}
            },
            "title": "Brief/E-Mail versenden"
        });
    });

    afterEach(function () {
        $('#main_content').remove();
        $('#sub_content').remove();
    });

    it("renders a dropdown of type chosen.", function (done) {
        $(view).bind('after-render', function () {
            var container = view.dom().find('.chosen-container');
            // open the dropdown
            container.trigger("mousedown");
            // select last field from dropdown
            container.find(".active-result").last().trigger("mouseup");
            expect(view.dom().find('select').val()).toBe('160');
            expect(
                ajja.Form.prototype.save
            ).toHaveBeenCalledWith(
                'member_id',
                {token: 160, title: 'Albrecht, Brigitte (407)'}
            );
            done();
        });
    });

    it("renders a textarea with a markdown editor.", function (done) {
        $(view).bind('after-render', function () {
            var editor = view.dom().find('.md-editor');
            expect(editor.length).toBe(1);
            editor.find('button[title=Bold]').click();
            expect(
                editor.find('.md-input').val()
            ).toEqual('**strong text**');
            editor.find('.md-input').val('asdf');
            editor.find('.md-input').change();
            expect(
                ajja.Form.prototype.save
            ).toHaveBeenCalledWith('body', 'asdf');
            done();
        });
    });

    it("renders a datetime picker.", function (done) {
        $(view).bind('after-render', function () {
            var picker = view.dom().find('.datetimepicker');
            expect(picker.length).toBe(1);
            picker.click();
            expect(
                ajja.Form.prototype.save
            ).toHaveBeenCalledWith('day', '08.02.2016 15:45');
            done();
        });
    });

    it("can initialize a DisplayListWidget.", function (done) {
        $(view).bind('after-render', function () {
            expect(
                sw.allotmentclub.DisplayListWidget.prototype.__init__
            ).toHaveBeenCalledWith(
                jasmine.any(Object)
            );
            done();
        });

    });
});
