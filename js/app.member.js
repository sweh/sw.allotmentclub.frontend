/*global sw, Rollbar */
(function () {
    "use strict";

    try {
        var MemberListView, MemberUploadForm,
            MemberAssignmentsView, MemberAssignmentsBillView,
            MemberAssignmentsDetailView, MemberSaleHistoryView;

        MemberListView = sw.allotmentclub.TableView.$extend({
            title: 'Liste der Mitglieder',
            page_length: 7,
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.member_list_view = new MemberListView(
            'member_list'
        );
        sw.allotmentclub.member_list_tapped_view = new MemberListView(
            'member_list_leased'
        );
        sw.allotmentclub.member_list_tap_water_view = new MemberListView(
            'member_list_tap_water'
        );

        MemberSaleHistoryView = sw.allotmentclub.TableView.$extend({
            viewname: 'member_sale_history',
            title: 'Verkaufshistorie',
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.member_sale_history_view = new MemberSaleHistoryView();

        sw.allotmentclub.member_add = new sw.allotmentclub.AddJSFormView(
            'member_add'
        );

        sw.allotmentclub.member_edit = new sw.allotmentclub.EditJSFormView(
            'member_edit'
        );

        sw.allotmentclub.membership_fee = new sw.allotmentclub.View(
            'membership_fee'
        );

        MemberUploadForm = sw.allotmentclub.UploadForm.$extend({
            template: 'upload',
            allowed_types: ".csv,text/csv",
            callback: function () {
                sw.allotmentclub.member_list_view.render();
            }
        });

        sw.allotmentclub.member_upload_form = new MemberUploadForm(
            'member_import'
        );

        sw.allotmentclub.direct_debit_letter = new sw.allotmentclub.DownloadView(
            'direct_debit_letter'
        );

        sw.allotmentclub.become_member_letter = new sw.allotmentclub.DownloadView(
            'become_member_letter'
        );

        sw.allotmentclub.member_export = new sw.allotmentclub.DownloadView(
            'member_export'
        );

        MemberAssignmentsView = sw.allotmentclub.TableView.$extend({
            viewname: 'member_assignments',
            title: 'Liste der geleisteten Arbeitsstunden',
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.member_assignments = new MemberAssignmentsView();

        MemberAssignmentsDetailView = sw.allotmentclub.TableView.$extend({
            viewname: 'member_assignments_detail',
            title: 'Liste der Arbeitseinsätze',
            is_subview: true
        });

        sw.allotmentclub.member_assignments_detail = new MemberAssignmentsDetailView();

        MemberAssignmentsBillView = sw.allotmentclub.View.$extend({
            viewname: 'member_assignments_bill'
        });
        sw.allotmentclub.member_assignments_bill = new MemberAssignmentsBillView();

        sw.allotmentclub.member_assignments_bill_print = new sw.allotmentclub.DownloadView(
            'member_assignments_bill_print'
        );

        sw.allotmentclub.member_sale = new sw.allotmentclub.EditJSFormView(
            'member_sale'
        );

        sw.allotmentclub.mv_entrance_list_view = new sw.allotmentclub.DownloadView(
            'mv_entrance_list'
        );

    } catch (e) {
        Rollbar.critical(e);
        sw.flashmessage.error(e);
    }

}());
