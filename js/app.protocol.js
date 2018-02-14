/*global sw, Rollbar */
(function () {
    "use strict";

    try {
        var ProtocolListView, ProtocolDetailView, AttachmentUploadForm,
            ProtocolAttachmentView, ProtocolCommitmentView;

        ProtocolListView = sw.allotmentclub.TableView.$extend({
            viewname: 'protocols',
            title: 'Übersicht',
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.protocol_list_view = new ProtocolListView();

        sw.allotmentclub.protocol_add = new sw.allotmentclub.AddJSFormView(
            'protocol_add'
        );

        sw.allotmentclub.protocol_edit = new sw.allotmentclub.EditJSFormView(
            'protocol_edit'
        );

        sw.allotmentclub.protocol_delete = new sw.allotmentclub.DeleteView(
            'protocol_delete'
        );


        ProtocolDetailView = sw.allotmentclub.TableView.$extend({
            url: '/api/protocols/{}/details',
            viewname: 'protocol_detail',
            title: 'Details',
            is_subview: true
        });
        sw.allotmentclub.protocol_detail_view = new ProtocolDetailView();

        sw.allotmentclub.protocol_detail_add = new sw.allotmentclub.AddJSFormView(
            'protocol_detail_add'
        );

        sw.allotmentclub.protocol_detail_edit = new sw.allotmentclub.EditJSFormView(
            'protocol_detail_edit'
        );

        sw.allotmentclub.protocol_detail_delete = new sw.allotmentclub.DeleteView(
            'protocol_detail_delete'
        );

        ProtocolAttachmentView = sw.allotmentclub.TableView.$extend({
            viewname: 'protocol_attachment',
            title: 'Anlagen',
            is_subview: true
        });
        sw.allotmentclub.protocol_attachment_view = new ProtocolAttachmentView();

        AttachmentUploadForm = sw.allotmentclub.UploadForm.$extend({
            template: 'upload',
            allowed_types: 'image/*,.jpg,.gif,.png',
            is_subview: true,
            callback: function () {
                sw.allotmentclub.protocol_list_view.render();
            }
        });
        sw.allotmentclub.protocol_attachment_add = new AttachmentUploadForm(
            'protocol_attachment_add'
        );

        sw.allotmentclub.protocol_attachment_download = new sw.allotmentclub.DownloadView(
            'protocol_attachment_download'
        );

        sw.allotmentclub.protocol_attachment_delete = new sw.allotmentclub.DeleteView(
            'protocol_attachment_delete'
        );

        ProtocolCommitmentView = sw.allotmentclub.TableView.$extend({
            viewname: 'protocol_commitment',
            title: 'Absprachen',
            is_subview: true
        });
        sw.allotmentclub.protocol_commitment_view = new ProtocolCommitmentView();

        sw.allotmentclub.protocol_commitment_add = new sw.allotmentclub.AddJSFormView(
            'protocol_commitment_add'
        );

        sw.allotmentclub.protocol_commitment_edit = new sw.allotmentclub.EditJSFormView(
            'protocol_commitment_edit'
        );

        sw.allotmentclub.protocol_commitment_delete = new sw.allotmentclub.DeleteView(
            'protocol_commitment_delete'
        );

        sw.allotmentclub.protocol_download = new sw.allotmentclub.DownloadView(
            'protocol_print'
        );

    } catch (e) {
        Rollbar.critical(e);
        sw.flashmessage.error(e);
    }

}());
