/*global sw */
(function () {
    "use strict";

    try {
        var WasteWaterView;

        WasteWaterView = sw.allotmentclub.TableView.$extend({
            title: 'Abwasser Liste',
            page_length: 12,
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.waste_water_view = new WasteWaterView(
            'waste_water'
        );

    } catch (e) {
        sw.flashmessage.error(e);
    }

}());

