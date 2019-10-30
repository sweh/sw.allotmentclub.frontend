/*global sw */
(function () {
    "use strict";

    try {
        var GrundsteuerBView;

        GrundsteuerBView = sw.allotmentclub.TableView.$extend({
            title: 'Grundsteuer B Liste',
            page_length: 12,
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.waste_water_view = new GrundsteuerBView(
            'property_tax_b'
        );

    } catch (e) {
        sw.flashmessage.error(e);
    }

}());
