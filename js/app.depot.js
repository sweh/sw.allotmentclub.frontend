/*global sw, Rollbar */
(function () {
    "use strict";

    try {
        var DepotListView, DepotUploadForm;


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
        sw.allotmentclub.depot_edit = new DepotUploadForm(
            'depot_edit'
        );

        sw.allotmentclub.depot_delete = new sw.allotmentclub.DeleteView(
            'depot_delete'
        );

        sw.allotmentclub.depot_download = new sw.allotmentclub.DownloadView(
            'depot_download'
        );

    } catch (e) {
        Rollbar.critical(e);
        sw.flashmessage.error(e);
    }

}());
