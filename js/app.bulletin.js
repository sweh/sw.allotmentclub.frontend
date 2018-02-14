/*global sw, Rollbar */
(function () {
    "use strict";

    try {
        var BulletinListView;

        BulletinListView = sw.allotmentclub.TableView.$extend({
            viewname: 'bulletins',
            title: 'Übersicht',
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.bulletin_list_view = new BulletinListView();

        sw.allotmentclub.bulletin_add = new sw.allotmentclub.AddJSFormView(
            'bulletin_add'
        );

        sw.allotmentclub.bulletin_edit = new sw.allotmentclub.EditJSFormView(
            'bulletin_edit'
        );

        sw.allotmentclub.bulletin_delete = new sw.allotmentclub.DeleteView(
            'bulletin_delete'
        );

        sw.allotmentclub.bulletin_print = new sw.allotmentclub.DownloadView(
            'bulletin_print'
        );

    } catch (e) {
        Rollbar.critical(e);
        sw.flashmessage.error(e);
    }

}());
