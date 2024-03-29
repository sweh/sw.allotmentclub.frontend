/*global sw */
(function () {
    "use strict";

    try {
        var DepotListView, DepotUploadForm, DepotEditView;


        DepotListView = sw.allotmentclub.TableView.$extend({
            viewname: 'depots',
            title: 'Ablage',
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.depot_list_view = new DepotListView();

        DepotUploadForm = sw.allotmentclub.UploadForm.$extend({
            template: 'upload',
            is_subview: true,
            callback: function () {
                sw.allotmentclub.depot_list_view.render();
            }
        });
        sw.allotmentclub.depot_add = new DepotUploadForm(
            'depot_add'
        );
        DepotEditView = sw.allotmentclub.EditJSFormView.$extend({
            viewname: 'depot_edit',
        });
        sw.allotmentclub.depot_edit = new DepotEditView('depot_edit');

        sw.allotmentclub.depot_delete = new sw.allotmentclub.DeleteView(
            'depot_delete'
        );

        sw.allotmentclub.depot_download = new sw.allotmentclub.DownloadView(
            'depot_download'
        );

    } catch (e) {
        sw.flashmessage.error(e);
    }

}());
