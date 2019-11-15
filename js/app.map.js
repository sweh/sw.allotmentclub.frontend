/*global jQuery, document, svgPanZoom, sw, */
/*global window, unescape */
/*jslint nomen: true, unparam: true, bitwise: true*/
(function ($) {
    "use strict";

    try {
        var MapView, MapDownloadView, ParcelListView, ParcelAttachmentAddView;

        MapView = sw.allotmentclub.TableView.$extend({
            viewname: 'map',
            template: 'map',

            initialize: function (data) {
                var self = this, panZoom;
                self.$super(data);
                self.dom().find('#map_container').html($("<div/>").html(data.map).html());
                self.dom().find('path').each(function (_, p) {
                    var path = $(p),
                        id = path.attr('id'),
                        parcel,
                        path_data;
                    if (!id.startsWith('FS')) {
                        return;
                    }
                    parcel = id.replace('FS', '');
                    path_data = data.map_data[parcel];
                    if (path_data) {
                        self.addText(p, parcel + ' (' + path_data[0] + ')', 0);
                        self.addText(p, path_data[1], 20, true);
                    } else {
                        self.addText(p, parcel, 0, true);
                    }
                });
                sw.allotmentclub.raw_map = self.dom().find('#map_container').html();
                panZoom = svgPanZoom('#map_container svg', {
                    zoomEnabled: true,
                    controlIconsEnabled: true,
                    fit: true,
                    center: true
                });
                $(window).resize(function () {
                    panZoom.resize();
                    panZoom.fit();
                    panZoom.center();
                });
            },

            addText: function (p, text, y, remove) {
                var t = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "text"
                    ),
                    b = p.getBBox();
                t.setAttribute(
                    "transform",
                    "translate(" + (b.x - text.length) + " " + (b.y + y) + ")"
                );
                t.textContent = text;
                t.setAttribute("font-size", "15");
                t.setAttribute("font-family", "'Open Sans',Arial,Helvetica,sans-serif");
                p.parentNode.insertBefore(t, p.nextSibling);
                if (remove) {
                    $(p).remove();
                }
            }
        });

        sw.allotmentclub.map = new MapView();

        MapDownloadView = sw.allotmentclub.View.$extend({
            viewname: 'map_download',

            ajax: function () {
                var self = this, form, node;
                form = document.createElement("form");
                node = document.createElement("input");
                form.action = self.url;
                form.method = 'POST';
                node.name = 'svg';
                node.value = sw.allotmentclub.raw_map;
                form.appendChild(node);
                form.style.display = "none";
                document.body.appendChild(form);
                form.submit();
            }
        });
        sw.allotmentclub.map_download = new MapDownloadView();

        ParcelListView = sw.allotmentclub.TableView.$extend({
            viewname: 'parcel_list',
            title: 'Flurstücke',
            default_sort_by: [[1, "desc"]]
        });
        sw.allotmentclub.parcel_list_view = new ParcelListView();


        ParcelAttachmentAddView = sw.allotmentclub.UploadForm.$extend({
            template: 'upload',
            is_subview: true,
            callback: function () {
                sw.allotmentclub.parcel_list_view.render();
            }
        });

        sw.allotmentclub.parcel_map_upload_view = new ParcelAttachmentAddView(
            'parcel_map_upload'
        );

        sw.allotmentclub.parcel_map_download_check_view = new sw.allotmentclub.View(
            'parcel_map_download_check'
        );

        sw.allotmentclub.parcel_map_download_view = new sw.allotmentclub.DownloadView(
            'parcel_map_download'
        );

    } catch (e) {
        sw.flashmessage.error(e);
    }

}(jQuery));
