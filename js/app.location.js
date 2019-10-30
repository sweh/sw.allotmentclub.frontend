/*global Class, sw, window */
(function () {
    "use strict";

    try {

        var Location;

        Location = Class.$extend({

            error: 'Bitte zuerst eine Zeile markieren',
            main_view: null,
            main_selected: null,
            sub_view: null,
            sub_selected: null,
            third_view: null,

            reset: function (level) {
                var self = this;
                if (level === 'main') {
                    self.main_view = null;
                    self.main_selected = null;
                    self.sub_view = null;
                    self.sub_selected = null;
                    self.third_view = null;
                }
                if (level === 'second') {
                    self.sub_view = null;
                    self.sub_selected = null;
                    self.third_view = null;
                }
                if (level === 'third') {
                    self.third_view = null;
                }
            },

            update: function () {
                var self = this,
                    viewname = window.location.href.split(/#(.+)/)[1];
                if (!viewname) {
                    self.reset('main');
                    self.main_view = 'home';
                    return;
                }
                self.main_view = viewname;
            },

            set: function () {
                var self = this,
                    base = window.location.href.split('#')[0];
                window.location.href = base + '#' + self.main_view;
            },

            select: function (viewname, id, level) {
                var self = this;
                if (level) {
                    self.reset(level);
                }
                if ((!self.main_view) || (self.main_view === viewname)) {
                    self.main_view = viewname;
                    self.main_selected = id;
                } else if ((!self.sub_view) || (self.sub_view === viewname)) {
                    self.sub_view = viewname;
                    self.sub_selected = id;
                } else if (!self.third_view) {
                    self.third_view = viewname;
                } else {
                    self.sub_view = viewname;
                    self.sub_selected = null;
                }
                self.set();
            },

            selected_main: function () {
                var self = this;
                if (self.main_selected) {
                    return self.main_selected;
                }
                sw.flashmessage.warning(self.error);
                return '';
            },

            selected_sub: function () {
                var self = this;
                if (self.sub_selected) {
                    return self.sub_selected;
                }
                sw.flashmessage.warning(self.error);
                return '';
            },

            base_view: function (viewname) {
                var self = this;
                if (self.third_view === viewname) {
                    return self.sub_view;
                }
                if (self.sub_view === viewname) {
                    return self.main_view;
                }
                return 0;
            },

            current: function () {
                var self = this;
                self.update();
                return self.main_view;
            }

        });

        sw.allotmentclub.location = new Location();


    } catch (e) {
        sw.flashmessage.error(e);
    }

}());
