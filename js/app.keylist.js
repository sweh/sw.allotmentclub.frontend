/*global sw */
(function () {
    "use strict";

    try {
        var KeylistsView, KeysView, KeylistAttachmentView,
            AttachmentUploadForm;

        KeylistsView = sw.allotmentclub.TableView.$extend({
            viewname: 'keylists',
            title: 'Übersicht',
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.keylist_list_view = new KeylistsView();

        sw.allotmentclub.keylist_add = new sw.allotmentclub.AddJSFormView(
            'keylist_add'
        );

        sw.allotmentclub.keylist_edit = new sw.allotmentclub.EditJSFormView(
            'keylist_edit'
        );

        sw.allotmentclub.keylist_delete = new sw.allotmentclub.DeleteView(
            'keylist_delete'
        );


        KeysView = sw.allotmentclub.TableView.$extend({
            url: '/api/keylists/{}/keys',
            viewname: 'keys',
            title: 'Schlüssel',
            is_subview: true
        });
        sw.allotmentclub.keys_view = new KeysView();

        sw.allotmentclub.key_add = new sw.allotmentclub.AddJSFormView(
            'key_add'
        );

        sw.allotmentclub.key_edit = new sw.allotmentclub.EditJSFormView(
            'key_edit'
        );

        sw.allotmentclub.key_delete = new sw.allotmentclub.DeleteView(
            'key_delete'
        );

        KeylistAttachmentView = sw.allotmentclub.TableView.$extend({
            viewname: 'keylist_attachment',
            title: 'Anlagen',
            is_subview: true
        });
        sw.allotmentclub.keylist_attachment_view = new KeylistAttachmentView();

        AttachmentUploadForm = sw.allotmentclub.UploadForm.$extend({
            template: 'upload',
            allowed_types: 'image/*,.jpg,.gif,.png',
            is_subview: true,
            callback: function () {
                sw.allotmentclub.keylist_list_view.render();
            }
        });
        sw.allotmentclub.keylist_attachment_add = new AttachmentUploadForm(
            'keylist_attachment_add'
        );

        sw.allotmentclub.keylist_attachment_download = new sw.allotmentclub.DownloadView(
            'keylist_attachment_download'
        );
    } catch (e) {
        sw.flashmessage.error(e);
    }

}());
