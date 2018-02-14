/*global sw, Rollbar */
(function () {
    "use strict";

    try {
        var ExternalListView;

        ExternalListView = sw.allotmentclub.TableView.$extend({
            viewname: 'externals',
            title: 'Externe Empfänger',
            page_length: 7,
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.externals_list_view = new ExternalListView();

        sw.allotmentclub.external_add = new sw.allotmentclub.AddJSFormView(
            'external_add'
        );

        sw.allotmentclub.external_edit = new sw.allotmentclub.EditJSFormView(
            'external_edit'
        );

    } catch (e) {
        Rollbar.critical(e);
        sw.flashmessage.error(e);
    }

}());
