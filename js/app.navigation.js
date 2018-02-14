/*global jQuery, sw, drawBreadCrumb, window, Rollbar */
(function ($) {
    "use strict";

    try {

        var Navigation;

        Navigation = sw.allotmentclub.View.$extend({
            url: '/api/navigation',
            callbacks: {},
            page_title: 'Startseite',
            page_icon: 'fa-home',
            main_selector: '.navbar-main',
            template: 'navigation',

            update: function (items) {
                var self = this;
                if (!items) {
                    self.ajax(self.url);
                    return;
                }
                self.render({'items': items});
                self.dom().jarvismenu({
                    closedSign: '<em class="fa fa-plus-square-o"></em>',
                    openedSign: '<em class="fa fa-minus-square-o"></em>'
                });
                $.each(self.dom().find('a'), function (i, elem) {
                    elem = $(elem);
                    if (elem.find('.collapse-sign').length) {
                        return;
                    }
                    elem.click(function (ev) { self.click_handler(ev); });
                });
                self.load_index();
            },

            load_index: function () {
                var self = this,
                    view = sw.allotmentclub.location.current();
                self.dom().find('a[href="#' + view + '"]').click();
            },

            click_handler: function (ev) {
                ev.preventDefault();
                var self = this,
                    target = $(ev.currentTarget),
                    viewname = target.attr('href').replace('#', ''),
                    url = window.application_url + target.data('url');
                self.activate(target, viewname);
                self.load_view(viewname, url);

            },

            activate: function (target, viewname) {
                var self = this;
                if (target.parents('.navbar-main').length) {
                    $('li.active').removeClass('active');
                    target.parents('li').addClass('active');
                    drawBreadCrumb();
                    self.page_title = target.data('title');
                    self.page_css = target.data('css');
                    sw.allotmentclub.location.reset('main');
                }
                sw.allotmentclub.location.select(
                    viewname,
                    null,
                    self._get_level(target)
                );
            },

            _get_level: function (target) {
                if (target.parents('.navbar-main').length) {
                    return 'main';
                }
                if (target.parents('#main_content').length) {
                    return 'second';
                }
                if (target.parents('#sub_content').length) {
                    return 'third';
                }
                sw.flashmessage.warning('Konnte Level nicht bestimmen!');
                throw 'Konnte Level nicht bestimmen!';
            },

            load_view: function (viewname, url, id) {
                var self = this, view;
                if (!id) {
                    if ($('.page-title').length) {
                        $('.page-title')[0].childNodes[2].textContent = ' ' + self.page_title;
                        $('.page-title').find('i').attr(
                            'class',
                            'fa-fw fa ' + self.page_css
                        );
                    }
                }
                if (self.callbacks.hasOwnProperty(viewname)) {
                    view = self.callbacks[viewname];
                    view.url = url;
                    self.prepare_year_selection(view);
                    view.render();
                } else {
                    sw.flashmessage.warning(
                        'Konnte Link "' + viewname + '" nicht aktivieren'
                    );
                }
            },

            prepare_year_selection: function (view) {
                var for_year = $('select[name="for_year"]');
                if (!view.is_subview) {
                    return;
                }
                if (for_year.length !== 1) {
                    return;
                }
                view.initial_year_selection = for_year.val();
            },

            success_handler: function (url, data) {
                var self = this;
                self.$super(url, data);
                if (data.status === 'success') {
                    self.update(data.data);
                }
            },

            success_callback: function () {
                // Do nothing here!
            }
        });

        sw.allotmentclub.navigation = new Navigation();


    } catch (e) {
        Rollbar.critical(e);
        sw.flashmessage.error(e);
    }

}(jQuery));
