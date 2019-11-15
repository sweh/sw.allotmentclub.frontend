/*global sw */
(function () {
    "use strict";

    try {
        var ElectricityListView, EnergyValueView, ElectricityUploadForm,
            AdvancePayValueView, GlobalEnergyValueListView,
            EnergyMeterImportForm, EnergyPriceView;

        ElectricityListView = sw.allotmentclub.TableView.$extend({
            viewname: 'electricity_list',
            title: 'Liste Stromzähler',
            default_sort_by: [[2, "asc"]]
        });
        sw.allotmentclub.electricity_list_view = new ElectricityListView();

        GlobalEnergyValueListView = sw.allotmentclub.TableView.$extend({
            viewname: 'global_energy_value_list',
            title: 'Liste Abrechnungen',
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.global_energy_value_list_view = new GlobalEnergyValueListView();

        sw.allotmentclub.energy_meter_export_view = new sw.allotmentclub.DownloadView(
            'energy_meter_export'
        );

        EnergyMeterImportForm = sw.allotmentclub.UploadForm.$extend({
            template: 'upload',
            allowed_types: ".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            is_subview: true,
            callback: function () {
                sw.allotmentclub.electricity_list_view.render();
            }
        });

        sw.allotmentclub.energy_meter_import_form = new EnergyMeterImportForm(
            'energy_meter_import'
        );

        sw.allotmentclub.calculate_energy_values = new sw.allotmentclub.View(
            'calculate_energy_values'
        );

        EnergyValueView = sw.allotmentclub.TableView.$extend({
            viewname: 'energy_value_list',
            title: 'Energieabrechnungen',
            is_subview: true,
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.energy_value_list_view = new EnergyValueView();

        AdvancePayValueView = sw.allotmentclub.TableView.$extend({
            viewname: 'advance_pay_value_list',
            title: 'Abschläge',
            is_subview: true,
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.advance_pay_value_list_view = new AdvancePayValueView();

        ElectricityUploadForm = sw.allotmentclub.UploadForm.$extend({
            template: 'upload',
            allowed_types: ".csv,text/csv",
            callback: function () {
                sw.allotmentclub.electricity_list_view.render();
            }
        });

        sw.allotmentclub.electricity_upload_form = new ElectricityUploadForm(
            'electricity_import'
        );


        sw.allotmentclub.energy_value_download = new sw.allotmentclub.DownloadView(
            'energy_value_print'
        );

        EnergyPriceView = sw.allotmentclub.TableView.$extend({
            viewname: 'energy_price',
            title: 'Kennzahlen',
            default_sort_by: [[2, "asc"]]
        });
        sw.allotmentclub.energy_price_view = new EnergyPriceView();

        sw.allotmentclub.export_wire_transfer_view = new sw.allotmentclub.DownloadView(
            'export_wire_transfer'
        );

    } catch (e) {
        sw.flashmessage.error(e);
    }

}());
