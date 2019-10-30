/*global jQuery, Class, sw, FormData, drawBreadCrumb, window */
/*jslint nomen: true, unparam: true, bitwise: true*/
(function ($) {
    "use strict";

    var $chrt_border_color = "#efefef";
    var $chrt_grid_color = "#DDD";
    var $chrt_main = "#E24913";         /* red       */
    var $chrt_second = "#6595b4";       /* blue      */
    var $chrt_third = "#FF9F01";        /* orange    */
    var $chrt_fourth = "#7e9d3a";       /* green     */
    var $chrt_fifth = "#BD362F";        /* dark red  */
    var $chrt_mono = "#000";

    try {
        var DashboardView;

        DashboardView = sw.allotmentclub.View.$extend({
            viewname: 'dashboard',
            template: 'dashboard',

            initialize: function (data) {
                var self = this;
                self.data = data;
                self.helioschart();
                self.update_temp_badge(self.data);
            },

            helioschart: function() {
                var self = this;
                if ($("#helioschart").length) {
                    var options = {
                        xaxis : {
                            mode : "time",
                            tickLength : 5
                        },
                        series : {
                            lines : {
                                show : true,
                                lineWidth : 1,
                                fill : true,
                                fillColor : {
                                    colors : [{
                                        opacity : 0.1
                                    }, {
                                        opacity : 0.15
                                    }]
                                }
                            },
                            //points: { show: true },
                            shadowSize : 0
                        },
                        selection : {
                            mode : "x"
                        },
                        grid : {
                            hoverable : true,
                            clickable : true,
                            tickColor : $chrt_border_color,
                            borderWidth : 0,
                            borderColor : $chrt_border_color,
                        },
                        tooltip : false,
                        colors : [
                            self.data.temperatures[0].color,
                            self.data.temperatures[1].color,
                            self.data.temperatures[2].color,
                            self.data.temperatures[3].color,
                        ],

                    };

                    $.plot(
                        $("#helioschart"),
                        [
                            self.data.plots[0],
                            self.data.plots[1],
                            self.data.plots[2],
                            self.data.plots[3],
                        ],
                        options);
                    }
                }

        });

        sw.allotmentclub.dashboard = new DashboardView();

        window.setInterval(function(){
            sw.allotmentclub.dashboard.render();
        }, 5000);

    } catch (e) {
        sw.flashmessage.error(e);
    }

}(jQuery));

