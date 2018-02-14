/*global document, jQuery, window, sw, Offline, Rollbar */
(function ($) {
    "use strict";
    try {

        var isUndefinedOrNull, declare_namespace;

        isUndefinedOrNull = function (o) {
            if (!(o === undefined || o === null)) {
                return false;
            }
            return true;
        };

        declare_namespace = function (namespace) {
            var obj = window;
            $.each(namespace.split('.'), function (i, name) {
                if (isUndefinedOrNull(obj[name])) {
                    obj[name] = {};
                }
                obj = obj[name];
            });
        };

        Offline.options = {
            checkOnLoad: true,
            interceptRequests: true,
            reconnect: {
                initialDelay: 3,
                delay: 1.5
            },
            requests: false,
            checks: {xhr: {url: '/api/login'}},
            game: false
        };

        declare_namespace('sw.allotmentclub');
        declare_namespace('sw.flashmessage');

        sw.allotmentclub.isUndefinedOrNull = isUndefinedOrNull;
        sw.allotmentclub.declare_namespace = declare_namespace;

        sw.allotmentclub.online = function () {
            var status = Offline.state, color, message;
            if (status === 'up') {
                message = 'ONLINE\nKlicken, um OFFLINE zu gehen.';
                color = '#8ac38b';
            } else {
                message = 'OFFLINE\nKlicken, um ONLINE zu gehen.';
                color = '#953b39';
            }
            $('#online_status a').attr('style', 'color: ' + color);
            $('#online_status a').attr('title', message);
            if (status === 'up') {
                return true;
            }
            return false;
        };

        Offline.on('up', sw.allotmentclub.online);
        Offline.on('down', sw.allotmentclub.online);

        sw.flashmessage.notify = function (message) {
            if (!message) {
                return;
            }
            var items = message.split(/\.(.+)?/);
            $.smallBox({
                title: items[0],
                content: items[1],
                color: "#739E73",
                iconSmall: "fa fa-check",
                timeout: 5000
            });
        };

        sw.flashmessage.error = function (error) {
            $.smallBox({
                title: "Es ist ein Fehler aufgetreten!",
                content: error,
                color: "#C46A69",
                icon: "fa fa-warning",
                timeout: 5000
            });
        };

        sw.flashmessage.warning = function (message) {
            if (!message) {
                return;
            }
            $.smallBox({
                title: "Hinweis",
                content: message,
                color: "#dfb56c",
                icon: "fa fa-bell",
                timeout: 5000
            });
        };

        $(document).ajaxStart(function () {
            $.blockUI(
                {
                    message: '',
                    onBlock: function () {
                        $('.pace').removeClass('pace-inactive');
                    },
                    onUnblock: function () {
                        $('.pace').addClass('pace-inactive');
                    }
                }
            );
        }).ajaxStop($.unblockUI);

        $(document).delegate('textarea.md-input', 'keydown', function (e) {
            var keyCode = e.keyCode || e.which, start, end;

            if (keyCode === 9) {
                e.preventDefault();
                start = $(this).get(0).selectionStart;
                end = $(this).get(0).selectionEnd;

                // set textarea value to: text before caret + 4 spaces + text after caret
                $(this).val($(this).val().substring(0, start) + "    " + $(this).val().substring(end));

                // put caret at right position again
                $(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + 1;
            }
        });

        if (typeof String.prototype.startsWith !== 'function') {
            String.prototype.startsWith = function (str) {
                return this.slice(0, str.length) === str;
            };
        }

        $(document).ready(function () {
            $('#online_status').click(function () {
                var state = Offline.state;
                if (state === 'up') {
                    Offline.state = 'down';
                    sw.allotmentclub.online();
                } else {
                    Offline.check();
                }
            });
        });

    } catch (e) {
        Rollbar.critical(e);
    }

}(jQuery));
