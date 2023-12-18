/*global sw */
(function () {
    "use strict";

    try {
        var BookingListView, MemberAccountListView,
            MemberAccountDetailListView, BankingAccountListView,
            BankingAccountListDetailView, BookingCSVImportView,
            SEPASammlerListView, SEPASammlerEntryListView,
            SEPADirectDebitView, MemberAccountDetailSwitchIRView;

        BookingListView = sw.allotmentclub.TableView.$extend({
            viewname: 'booking_list',
            title: 'Kontonummer: 3440000167',
            default_sort_by: [[1, "asc"], [2, "asc"]]
        });
        sw.allotmentclub.booking_list_view = new BookingListView();

        BookingCSVImportView = sw.allotmentclub.UploadForm.$extend({
            template: 'upload',
            is_subview: true,
            callback: function (a,b,c,d) {
                debugger;
                sw.allotmentclub.booking_list_view.render();
            }
        });
        sw.allotmentclub.booking_csv_import = new BookingCSVImportView(
            'booking_csv_import'
        );

        sw.allotmentclub.map_booking = new sw.allotmentclub.EditJSFormView(
            'map_booking'
        );

        sw.allotmentclub.split_booking = new sw.allotmentclub.EditJSFormView(
            'split_booking'
        );

        MemberAccountListView = sw.allotmentclub.TableView.$extend({
            viewname: 'member_account_list',
            title: 'Mitgliedskonten',
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.member_account_list_view = new MemberAccountListView();

        MemberAccountDetailListView = sw.allotmentclub.TableView.$extend({
            viewname: 'member_account_detail_list',
            title: 'Buchungsübersicht',
            is_subview: true,
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.member_account_detail_list_view = new MemberAccountDetailListView();

        MemberAccountDetailSwitchIRView = sw.allotmentclub.SaveAndReloadView.$extend({
            viewname: 'member_account_detail_switch_ir'
        });
        sw.allotmentclub.member_account_detail_switch_ir = new MemberAccountDetailSwitchIRView();

        BankingAccountListView = sw.allotmentclub.TableView.$extend({
            viewname: 'banking_account_list',
            title: 'Übersicht',
            default_sort_by: [[1, "asc"]],
            page_length: 30
        });
        sw.allotmentclub.banking_account_list_view = new BankingAccountListView();


        BankingAccountListDetailView = sw.allotmentclub.TableView.$extend({
            viewname: 'banking_account_list_detail',
            title: 'Position Detail',
            is_subview: true
        });
        sw.allotmentclub.banking_account_list_detail_view = new BankingAccountListDetailView();

        sw.allotmentclub.banking_account_list_report_view = new sw.allotmentclub.DownloadView(
            'banking_account_list_report'
        );

        SEPADirectDebitView = sw.allotmentclub.TableView.$extend({
            viewname: 'sepa_direct_debit',
            title: 'SEPA Lastschriften',
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.sepa_direct_debit_view = new SEPADirectDebitView();

        SEPASammlerListView = sw.allotmentclub.TableView.$extend({
            viewname: 'sepa_sammler_list',
            title: 'SEPA Sammler',
            default_sort_by: [[2, "asc"]]
        });
        sw.allotmentclub.sepa_sammler_list_view = new SEPASammlerListView();

        SEPASammlerEntryListView = sw.allotmentclub.TableView.$extend({
            viewname: 'sepa_sammler_entry_list',
            title: 'SEPA Sammler Details',
            is_subview: true,
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.sepa_sammler_entry_list_view = new SEPASammlerEntryListView();

        sw.allotmentclub.sepa_sammler_add = new sw.allotmentclub.AddJSFormView(
            'sepa_sammler_add'
        );

        sw.allotmentclub.sepa_ueberweisung_add = new sw.allotmentclub.AddJSFormView(
            'sepa_ueberweisung_add'
        );

        sw.allotmentclub.sepa_sammler_edit = new sw.allotmentclub.EditJSFormView(
            'sepa_sammler_edit'
        );

        sw.allotmentclub.sepa_sammler_update = new sw.allotmentclub.View(
            'sepa_sammler_update'
        );

        sw.allotmentclub.sepa_sammler_export = new sw.allotmentclub.DownloadView(
            'sepa_sammler_export'
        );

    } catch (e) {
        sw.flashmessage.error(e);
    }

}());
