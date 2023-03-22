/*global jQuery, Class, sw, document, localStorage, confirm */
/*global ajja, eval, ResponsiveDatatablesHelper, Dropzone */

var version = {
    "name": "sw.allotmentclub.frontend",
    "version": "5.9.1-dev.0"
};

sw.allotmentclub.version = version.version;


(function ($) {
    "use strict";

    Dropzone.autoDiscover = false;

    try {

        $(document).ready(function () {
            $('.page-footer .txt-color-white').html(
                'Sebastian Wehrmann © 2014 - ' +
                    new Date().getFullYear() +
                    ' (<a data-toggle="modal" style="color: white" data-show="true" data-remote="false" href="CHANGES.txt" data-target="#changelog">v' + sw.allotmentclub.version + '</a>)'
            );
            $("#changelog").on("show.bs.modal", function (e) {
                var link = $(e.relatedTarget);
                $(this).find(".modal-body").load(link.attr("href"));
            });
        });

        sw.allotmentclub.download = function (url) {
            $.fileDownload(url, {
                preparingMessageHtml: "Download wird vorbereitet, bitte warten...",
                failMessageHtml: "Es gab ein Problem mit dem Download. Bitte erneut versuchen."
            });
        };

        sw.allotmentclub.View = Class.$extend({
            url: null,
            viewname: null,
            main_selector: '#main_content',
            sub_selector: '#sub_content',
            template: null,

            __init__: function (viewname) {
                var self = this;
                if (!sw.allotmentclub.isUndefinedOrNull(viewname)) {
                    self.viewname = viewname;
                }
                if (sw.allotmentclub.navigation) {
                    sw.allotmentclub.navigation.callbacks[self.viewname] = self;
                }
            },

            dom: function () {
                var self = this;
                if (sw.allotmentclub.isUndefinedOrNull(self.is_subview)) {
                    return $(self.main_selector);
                }
                return $(self.sub_selector);
            },

            empty_dom: function () {
                var self = this;
                if (sw.allotmentclub.isUndefinedOrNull(self.is_subview)) {
                    $(self.main_selector).empty();
                }
                $(self.sub_selector).empty();
            },

            prepare_url: function () {
                var self = this;
                if (!self.url) {
                    return;
                }
                if (self.url.match(/\{\w*_id\}|{viewname}/)) {
                    self.url = self.url.replace(
                        self.url.match(/\{\w*_id\}|{viewname}/)[0],
                        sw.allotmentclub.location.selected_main()
                    );
                    self.url = self.url.replace(
                        '{id}',
                        sw.allotmentclub.location.selected_sub()
                    );
                } else if (self.url.indexOf('{id}') !== -1) {
                    self.url = self.url.replace(
                        '{id}',
                        sw.allotmentclub.location.selected_main()
                    );
                }
            },

            download: function () {
                var self = this,
                year = self.dom().find('select[name="for_year"]').val(),
                url = self.url;

                if (year) {
                    url = self.url + '?for_year=' + year;
                }
                sw.allotmentclub.download(url);
            },

            update_temp_badge: function (data) {
                if (data && data.temp) {
                    var t = data.temp.temperature;
                    var trend = data.temp.trend;
                    var date = data.temp.date;
                    var rain = data.temp.sum_rain_24;
                    var hue = 30 + 240 * (30 - t) / 60;

                    $('#sparks').attr('title', date);

                    $('.nt-temp').html(
                      '<i class="fa fa-arrow-circle-' + trend + '"></i> ' +
                      t + '&#8239;°C'
                    );
                    $('.nt-rain').html(
                      '<i class="fa fa-umbrella"></i> ' + rain + '&#8239;mm'
                    );
                    $('.nt-temp').css({'color': 'hsl(' + [hue, '70%', '50%'] + ')'});
                }
            },

            render: function (data) {
                var self = this, template, html, year;
                self.prepare_url();
                if (sw.allotmentclub.isUndefinedOrNull(data)) {
                    if (self.initial_year_selection) {
                        year = self.initial_year_selection;
                        self.initial_year_selection = null;
                    } else {
                        year = self.dom().find('select[name="for_year"]').val();
                    }
                    if (year) {
                        year = {for_year: year};
                    } else {
                        year = undefined;
                    }

                    self.ajax(self.url, year, function (adata) {
                        if (sw.allotmentclub.isUndefinedOrNull(adata)) {
                            adata = {};
                        }
                        self.render(adata);
                    });
                } else {
                    template = ajja.templates[self.template];
                    if (template) {
                        html = template(data);
                        self.empty_dom();
                        self.dom().append($(html));
                        if (self.initialize) {
                            self.initialize(data);
                        }
                    }
                }
            },

            ajax: function (url, data, callback, extra_args) {
                var self = this,
                    method = 'GET',
                    args,
                    keys;
                if (data) {
                    keys = Object.keys(data);
                    if ((keys.length !== 1) || (keys[0] !== 'for_year')) {
                        method = 'POST';
                    }
                }
                args = {
                    url: url,
                    method: method,
                    data: data,
                    success: function (adata) {
                        self.success_handler(url, adata, callback);
                    },
                    error: function (jqXHR, status, error) {
                        self.error_handler(url, callback, jqXHR, status, error);
                    }
                };
                if (extra_args) {
                    $.each(extra_args, function (key, value) {
                        args[key] = value;
                    });
                }
                if (sw.allotmentclub.online()) {
                    $.ajax(args);
                } else {
                    self.offline_handler(args, callback);
                }
            },

            success_handler: function (url, data, callback) {
                var self = this;
                if (!data) {
                    return;
                }
                if (url) {
                    self.offline_cache(url, data);
                }
                if (data.status === 'error') {
                    sw.flashmessage.warning(data.message);
                } else if (data.message) {
                    sw.flashmessage.notify(data.message);
                }
                if (data.status === 'success') {
                    if (!sw.allotmentclub.isUndefinedOrNull(callback)) {
                        callback(data.data);
                    }
                    if (data.redirect) {
                        sw.allotmentclub.download(data.redirect);
                    }
                }
            },

            success_callback: function () {
                var self = this,
                    view = sw.allotmentclub.location.base_view(self.viewname);
                sw.allotmentclub.navigation.callbacks[view].render();
            },

            error_handler: function (url, callback, jqXHR, status, error) {
                var self = this;
                if ((status === 'timeout') || (error === 'Bad Gateway')) {
                    // offline?
                    sw.allotmentclub.online(false);
                    self.success_handler(url, null, callback);
                } else {
                    sw.flashmessage.error(error);
                }
            },

            offline_handler: function (args, callback) {
                var self = this;
                return self.success_handler(
                    null,
                    self.offline_cache(args.url),
                    callback
                );
            },

            offline_cache: function (key, value) {
                if (value) {
                    return localStorage.setItem(key, JSON.stringify(value));
                } else {
                    var result = JSON.parse(localStorage.getItem(key));
                    if (!result) {
                        sw.flashmessage.warning(
                            'Offline nicht verfügbar. Seite einmal online ' +
                                'laden um sie offline zur Verfügung zu ' +
                                'stellen.'
                        );
                    }
                    return result;
                }
            }
        });


        sw.allotmentclub.TableView = sw.allotmentclub.View.$extend({

            template: 'table',
            title: null,
            info: null,
            default_sort_by: [[0, "asc"]],
            page_length: 12,

            initialize: function () {
                var self = this;
                self.initialize_actions();
            },

            initialize_actions: function () {
                var self = this,
                    year_switch = self.dom().find('select[name="for_year"]');
                if (year_switch.length) {
                    year_switch.change(function () {
                        self.render();
                    });
                }
                if (!self.dom().find('.actions').length) {
                    return;
                }
                self.dom().find('.actions a').each(function (_, elem) {
                    if (self.is_subview) {
                        if ($(elem).data('url').indexOf('_id}') !== -1) {
                            $(elem).addClass('disabled');
                        }
                    } else {
                        if ($(elem).data('url').indexOf('{id}') !== -1) {
                            $(elem).addClass('disabled');
                        }
                    }
                });
                self.dom().find('tbody tr').click(function (ev) {
                    var row = $(ev.target).parents('tr'),
                        id = row.find('td').first().text();
                    row.parents('tbody').find('tr').removeClass('danger');
                    sw.allotmentclub.location.select(self.viewname, id);
                    row.addClass('danger');
                    self.dom().find('.actions a').each(function (_, elem) {
                        $(elem).removeClass('disabled');
                    });
                });
                self.dom().find('.actions a').click(function (ev) {
                    ev.preventDefault();
                    sw.allotmentclub.navigation.click_handler(ev);
                });
            },

            render: function (data) {
                var self = this,
                    result;
                if (data) {
                    data.title = self.title;
                    data.info = self.info;
                }
                result = self.$super(data);
                if (!self.dom().find('.dataTables_filter').length) {
                    self.init_datatable();
                }
                return result;
            },

            register_kilowatthour_sorting: function () {
                $.fn.dataTableExt.aTypes.push(
                    function (sData) {
                        if (sData.substr(sData.length - 3) === 'kWh') {
                            return 'kilowatthour';
                        }
                        return null;
                    }
                );
                $.fn.dataTableExt.oSort['kilowatthour-asc'] = function (x, y) {
                    x = parseInt(x.substr(0, x.length - 4), 10);
                    y = parseInt(y.substr(0, y.length - 4), 10);
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                };
                $.fn.dataTableExt.oSort['kilowatthour-desc'] = function (x, y) {
                    x = parseInt(x.substr(0, x.length - 4), 10);
                    y = parseInt(y.substr(0, y.length - 4), 10);
                    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
                };
            },

            register_datetime_sorting: function () {
                $.fn.dataTable.moment('DD.MM.YYYY HH:mm');
            },

            register_date_sorting: function () {
                $.fn.dataTable.moment('DD.MM.YYYY');
            },

            init_datatable: function () {
                var self = this,
                    table = self.dom().find('table'),
                    breakpointDefinition = { tablet: 1024, phone: 480 };
                self.register_kilowatthour_sorting();
                self.register_datetime_sorting();
                self.register_date_sorting();
                table.dataTable({
                    'language': {
                        "sEmptyTable": "Keine Daten in der Tabelle vorhanden",
                        "sInfo": "_START_ bis _END_ von _TOTAL_ Einträgen",
                        "sInfoEmpty": "0 bis 0 von 0 Einträgen",
                        "sInfoFiltered": "(gefiltert von _MAX_ Einträgen)",
                        "sInfoPostFix": "",
                        "sInfoThousands": ".",
                        "sLengthMenu": "_MENU_ Einträge anzeigen",
                        "sLoadingRecords": "Wird geladen...",
                        "sProcessing": "Bitte warten...",
                        "sZeroRecords": "Keine Einträge vorhanden.",
                        "sSearch": "Suche",
                        "oPaginate": {
                            "sFirst": "Erste",
                            "sPrevious": "Zurück",
                            "sNext": "Nächste",
                            "sLast": "Letzte"
                        },
                        "oAria": {
                            "sSortAscending": ": aktivieren, um Spalte aufsteigend zu sortieren",
                            "sSortDescending": ": aktivieren, um Spalte absteigend zu sortieren"
                        }
                    },
                    'pageLength': self.page_length,
                    'lengthChange': false,
                    "autoWidth": true,
                    "order": self.default_sort_by,
                    "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs'T>r>" +
                            "t" +
                            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
                    "oTableTools": {
                        "aButtons": [
                            {
                                "sExtends": "print",
                                "sButtonText": "Druckansicht",
                                "sMessage": self.title + " <i>(Esc drücken, um diese Ansicht zu schließen)</i>"
                            }
                        ]
                    },
                    "preDrawCallback": function () {
                        if (!self.resphelper) {
                            self.resphelper = new ResponsiveDatatablesHelper(
                                table,
                                breakpointDefinition
                            );
                        }
                    },
                    "rowCallback": function (nRow) {
                        self.resphelper.createExpandIcon(nRow);
                    },
                    "drawCallback": function (oSettings) {
                        self.old_page = self.page;
                        self.old_search = self.search;
                        self.page = oSettings._iDisplayStart / self.page_length;
                        self.search = $('.dataTables_filter input').val();
                        self.resphelper.respond();
                    },
                    "initComplete": function () {
                        var page = self.old_page, search = self.old_search;
                        if (self.is_subview) {
                            return;
                        }
                        if (search) {
                            this.fnFilter(search);
                            self.search = self.old_search = search;
                        }
                        if (page) {
                            this.fnPageChange(page);
                            self.page = self.old_page = page;
                        }
                    }
                });
            }

        });

        sw.allotmentclub.DisplayListWidget = ajja.ListWidget.$extend({
            default_form_actions: [],
            default_item_actions: [],
            other_item_actions: [],
            item_download_action: {
                css_class: 'download',
                icon: 'glyphicon-download',
                title: 'Herunterladen',
                callback: function (node, widget) {
                    widget.download_item(node);
                }
            },
            item_del_action: {
                css_class: 'del',
                icon: 'glyphicon-trash',
                title: 'Löschen',
                callback: function (node, widget) {
                    if (confirm('Wirklich löschen?') === true) {
                        widget.del_item(node);
                    }
                }
            },

            __init__: function (node) {
                var self = this;
                if (node.data('disabled')) {
                    self.default_item_actions = [self.item_download_action];
                } else {
                    self.default_item_actions = [
                        self.item_download_action,
                        self.item_del_action
                    ];
                    $.each(self.other_item_actions, function (ind, obj) {
                        self.default_item_actions.push(obj);
                    });
                }
                self.$super(node);
            },

            download_item: function (node) {
                sw.allotmentclub.download(
                    node.data('resource').replace('/del', '/download')
                );
            }
        });

        sw.allotmentclub.DownloadView = sw.allotmentclub.View.$extend({

            ajax: function () {
                var self = this;
                self.download();
            }

        });

        sw.allotmentclub.AddJSFormView = sw.allotmentclub.View.$extend({
            template: 'ajja',
            is_subview: true,
            allowed_types: ".pdf,application/pdf",
            display_list_widget: sw.allotmentclub.DisplayListWidget,

            initialize: function (data) {
                var self = this, form, options, save_url = self.url;
                if (data.url) {
                    save_url = data.url;
                }
                options = {
                    'language': 'de',
                    'save_url': save_url,
                    'action': save_url
                };

                form = new ajja.Form('ajja', options);
                form.load(data.load_data, data.load_options);
                $(form).bind('after-load', function () {
                    $('select.chosen').chosen({width: '100%'});
                    $('textarea.markdown').markdown();
                    $('input.datetimepicker').on('dp.change', function (ev) {
                        $(ev.currentTarget).change();
                    });
                    $('input.datetimepicker').datetimepicker({
                        format: 'DD.MM.YYYY HH:mm',
                        locale: 'de',
                        stepping: 15
                    });
                    $('input.datepicker').on('dp.change', function (ev) {
                        $(ev.currentTarget).change();
                    });
                    $('input.datepicker').datetimepicker({
                        format: 'DD.MM.YYYY',
                        locale: 'de',
                    });
                    if ($('#documents-list').length) {
                        var widget, dropzone;
                        widget = new self.display_list_widget(
                            $('#documents-list')
                        );
                        widget.reload();

                        if ($('#upload').length) {
                            dropzone = new Dropzone('#upload', {
                                'url': save_url,
                                'acceptedFiles': self.allowed_types
                            });
                            dropzone.on('success', function (file, response) {
                                widget.render_item(response);
                                dropzone.removeFile(file);
                            });
                        }
                    }

                    $('#send-form').form_submit_button(function () {
                        form.node.parent().find('button#send-form').attr('disabled', false);
                        if (form.node.find('.alert-danger').length === 0) {
                            self.success_callback();
                        }
                    });

                    $(self).trigger('after-render');
                });
            }
        });

        sw.allotmentclub.EditJSFormView = sw.allotmentclub.AddJSFormView.$extend({
        });

        sw.allotmentclub.DeleteView = sw.allotmentclub.View.$extend({

            render: function () {
                var self = this;
                $.SmartMessageBox({
                    title: "Bestätigung erforderlich",
                    content: "Sind Sie sicher, dass Sie das ausgewählte Element löschen wollen?",
                    buttons: "[Abbrechen][Löschen]"
                }, function (ButtonPress) {
                    if (ButtonPress === "Abbrechen") {
                        return 0;
                    }
                    self.prepare_url();
                    self.ajax(self.url, null, function (data) {
                        if (sw.allotmentclub.isUndefinedOrNull(data)) {
                            data = {};
                        }
                        self.render(data);
                    });
                    return 0;
                });
            },

            success_handler: function (url, data) {
                var self = this;
                self.$super(url, data, function () { self.success_callback(); });
            }

        });

        sw.allotmentclub.UploadForm = sw.allotmentclub.View.$extend({

            allowed_types: null,
            callback: null,
            template: 'upload',

            initialize: function () {
                var self = this;
                self.dropzone = new Dropzone(
                    "#uploadform",
                    {
                        url: self.url,
                        acceptedFiles: self.allowed_types
                    }
                );
                self.dropzone.on('success', function () {
                    self.success_callback();
                });
            }
        });

        sw.allotmentclub.SaveAndReloadView = sw.allotmentclub.View.$extend({

            success_handler: function (url, data) {
                var self = this;
                self.$super(url, data, function () { self.success_callback(); });
            }

        });

    } catch (e) {
        sw.flashmessage.error(e);
    }

}(jQuery));
