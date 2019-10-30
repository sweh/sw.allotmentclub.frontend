/*global jQuery, sw */
(function ($) {
    "use strict";

    try {
        var MailAddView, MailListInboxView, MailListSentView, MailListDraftsView, MailEditView,
            MailReplyView, MailDuplicateView, MailDeleteView, AttachmentDisplayListWidget,
            MailStatusView;

        MailListInboxView = sw.allotmentclub.TableView.$extend({
            viewname: 'mail_list_inbox',
            title: 'Posteingang',
            default_sort_by: [[3, "desc"]]
        });
        sw.allotmentclub.mail_list_inbox_view = new MailListInboxView();

        MailListSentView = sw.allotmentclub.TableView.$extend({
            viewname: 'mail_list_sent',
            title: 'Gesendet',
            default_sort_by: [[4, "desc"]]
        });
        sw.allotmentclub.mail_list_sent_view = new MailListSentView();

        MailListDraftsView = sw.allotmentclub.TableView.$extend({
            viewname: 'mail_list_drafts',
            title: 'Entwürfe',
            default_sort_by: [[4, "asc"]]
        });
        sw.allotmentclub.mail_list_drafts_view = new MailListDraftsView();

        AttachmentDisplayListWidget = sw.allotmentclub.DisplayListWidget.$extend({
            other_item_actions: [{
                css_class: 'white_page_before',
                icon: 'fa fa-file-o',
                title: 'Weiße Seite einfügen',
                callback: function (node, widget) {
                    widget.change_white_page(node);
                }
            }],

            change_white_page: function (node) {
                var self = this, url;
                url = node.data('resource').replace('/del', '/change_white_page');
                $.ajax({
                    url: url,
                    type: 'PUT'
                }).done(function (data) {
                    node.data('data').title = data.title;
                    self.render_item_content(node);
                });
            }
        });

        MailAddView = sw.allotmentclub.AddJSFormView.$extend({
            viewname: 'mail_add',
            allowed_types: ".pdf,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png",
            display_list_widget: AttachmentDisplayListWidget
        });
        sw.allotmentclub.mail_add_view = new MailAddView('mail_add');


        MailEditView = sw.allotmentclub.EditJSFormView.$extend({
            viewname: 'mail_edit',
            allowed_types: ".pdf,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png",
            display_list_widget: AttachmentDisplayListWidget
        });
        sw.allotmentclub.mail_edit_view = new MailEditView('mail_edit');

        MailReplyView = sw.allotmentclub.EditJSFormView.$extend({
            viewname: 'mail_reply',
            display_list_widget: AttachmentDisplayListWidget
        });
        sw.allotmentclub.mail_reply_view = new MailReplyView('mail_reply');

        MailStatusView = sw.allotmentclub.TableView.$extend({
            viewname: 'mail_status',
            title: 'Übersicht Mail-Sende-Status',
            is_subview: true
        });
        sw.allotmentclub.mail_status_view = new MailStatusView();

        sw.allotmentclub.mail_print_view = new sw.allotmentclub.DownloadView(
            'mail_print'
        );

        sw.allotmentclub.mail_preview_view = new sw.allotmentclub.DownloadView(
            'mail_preview'
        );

        sw.allotmentclub.mail_send = new sw.allotmentclub.View(
            'mail_send'
        );

        MailDuplicateView = sw.allotmentclub.SaveAndReloadView.$extend({
            viewname: 'mail_duplicate'
        });
        sw.allotmentclub.mail_duplicate = new MailDuplicateView();

        MailDeleteView = sw.allotmentclub.DeleteView.$extend({
            viewname: 'mail_delete'
        });
        sw.allotmentclub.mail_delete = new MailDeleteView();

    } catch (e) {
        sw.flashmessage.error(e);
    }

}(jQuery));

