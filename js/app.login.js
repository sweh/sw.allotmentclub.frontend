/*global jQuery, sw, window, localStorage, VersionCompare */
(function ($) {
    "use strict";

    try {
        var Login;

        Login = sw.allotmentclub.View.$extend({
            main_selector: '.container.signin',

            __init__: function () {
                var self = this;
                asdf();
                self.login();
                self.form().on('submit', function (ev) {
                    ev.preventDefault();
                    self.login(true);
                });
                $('#logout a').click(function (ev) {
                    ev.preventDefault();
                    self.logout();
                });
            },

            form: function () {
                var self = this;
                return self.dom().find('form');
            },

            _control: function (type, value) {
                var self = this,
                    node = self.dom().find('.form-control[type=' + type + ']');
                if (!sw.allotmentclub.isUndefinedOrNull(value)) {
                    node.val(value);
                }
                return node.val();
            },

            username: function (value) {
                var self = this;
                value = self._control('username', value);
                if (!value) {
                    value = localStorage.getItem('username');
                }
                return value;
            },

            password: function (value) {
                var self = this;
                value = self._control('password', value);
                if (!value) {
                    value = localStorage.getItem('password');
                }
                return value;
            },

            remember: function () {
                return $('.form-control[type=checkbox]').is(":checked");
            },

            login: function () {
                var self = this,
                    user = self.username(),
                    pass = self.password(),
                    remember = self.remember(),
                    data = {username: user, password: pass};
                if (remember && user && pass) {
                    localStorage.setItem('username', user);
                    localStorage.setItem('password', pass);
                } else {
                    localStorage.setItem('username', '');
                    localStorage.setItem('password', '');
                }
                self.username('');
                self.password('');
                self.ajax('/api/login', data);
            },

            logout: function () {
                var self = this;
                localStorage.setItem('username', '');
                localStorage.setItem('password', '');
                self.ajax('/api/logout', null, function () { self.login(); });
            },

            update_user_badge: function (data) {
                if (data && data.user) {
                    $('.login-info img').attr('src', data.user.gravatar);
                    $('.login-info a span').text(data.user.name);
                }
            },

            toggle: function (make_visible, data) {
                var self = this;
                self.update_user_badge(data);
                self.update_temp_badge(data);
                if (!make_visible) {
                    self.dom().addClass('hide');
                    sw.allotmentclub.navigation.update();
                    $('#logout').removeClass('hide');
                } else {
                    self.dom().removeClass('hide');
                    $('#logout').addClass('hide');
                }
            },

            success_handler: function (url, data, callback) {
                var self = this,
                    base_url = window.location.href.split('#')[0];
                if ((data.version.indexOf('dev') === -1) &&
                        VersionCompare.gt(data.version, sw.allotmentclub.version)) {
                    if (base_url.indexOf('?reload') === -1) {
                        window.location.href = base_url + '?reload=' + data.version;
                    } else {
                        $.SmartMessageBox({
                            title: "Ein Problem ist aufgetreten.",
                            content: 'Der Software-Stand in Ihrem Browser ist ' +
                                      'niedriger als vom Server erwartet.<br /><br />' +
                                      '&nbsp;&nbsp;Browser: ' + sw.allotmentclub.version +
                                      '<br />&nbsp;&nbsp;Server: ' + data.version +
                                      '<br /><br />Drücken Sie <kbd>Strg</kbd> + ' +
                                      '<kbd>Shift</kbd> + <kbd>R</kbd>, um die ' +
                                      'Seite neu zu laden.',
                            buttons: ""
                        }, function () {
                            return 0;
                        });

                    }
                    return;
                }
                self.$super(url, data, callback);
                if (!data) {
                    self.toggle(true, data);
                    return;
                }
                if (data.status === 'error') {
                    self.toggle(true, data);
                } else {
                    self.toggle(false, data);
                }
            },

            success_callback: function () {
                // Do nothing here!
            }
        });

        sw.allotmentclub.login = function () {
            sw.allotmentclub.login = new Login();
        };

    } catch (e) {
        sw.flashmessage.error(e);
    }

}(jQuery));
