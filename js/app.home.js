/*global jQuery, Class, sw, FormData, drawBreadCrumb, window */
/*jslint nomen: true, unparam: true, bitwise: true*/
(function ($) {
    "use strict";

    try {
        var HomeView;

        HomeView = sw.allotmentclub.View.$extend({
            viewname: 'home',
            template: 'index',
            url: '/api/'
        });

        sw.allotmentclub.home = new HomeView();

    } catch (e) {
        sw.flashmessage.error(e);
    }

}(jQuery));
