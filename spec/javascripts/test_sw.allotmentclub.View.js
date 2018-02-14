/*global describe, document, $, ajja, sw, jasmine, beforeEach, it, expect */
/*global waits, runs, waitsFor, afterEach, spyOn, Handlebars, localStorage */
/*jslint nomen: true, unparam: true, bitwise: true*/

describe("sw.allotmentclub.View", function () {
    "use strict";

    var view;

    beforeEach(function () {
        $('body').append($('<div id="main_content"></div>'));
        $('body').append($('<div id="sub_content"></div>'));
        view = new sw.allotmentclub.View('my_view');
    });

    afterEach(function () {
        $('#main_content').remove();
        $('#sub_content').remove();
    });

    it("is available via navigation callback object.", function () {
        expect(sw.allotmentclub.navigation.callbacks.my_view).toEqual(view);
    });

    it("renders in `main_content` by default.", function () {
        expect(view.dom()).toEqual($('#main_content'));
    });

    it("renders in `sub_content` if subview.", function () {
        view.is_subview = true;
        expect(view.dom()).toEqual($('#sub_content'));
    });

    it(
        "has function `empty_dom` that removes all content in container.",
        function () {
            $('#main_content').append('<p></p>');
            expect(view.dom().html()).toEqual('<p></p>');
            view.empty_dom();
            expect(view.dom().html()).toEqual('');
        }
    );

    describe("has a function `prepare_url` that", function () {

        beforeEach(function () {
            spyOn(
                sw.allotmentclub.location,
                "selected_main"
            ).and.returnValue(42);
            spyOn(
                sw.allotmentclub.location,
                "selected_sub"
            ).and.returnValue(13);
        });

        it("matches {id} to the current selected item.", function () {
            view.url = '/cars/{id}';
            view.prepare_url();
            expect(view.url).toEqual('/cars/42');
        });

        it("can handle ids of view and subview.", function () {
            view.url = '/cars/{main_id}/wheels/{id}';
            view.prepare_url();
            expect(view.url).toEqual('/cars/42/wheels/13');
        });

        it("does nothing if ids have already been replaced.", function () {
            view.url = '/cars/42/wheels/13';
            view.prepare_url();
            expect(view.url).toEqual('/cars/42/wheels/13');
        });
    });

    describe("has a function `render` that", function () {

        beforeEach(function () {
            spyOn(sw.allotmentclub.View.prototype, "prepare_url");
            spyOn(sw.allotmentclub.View.prototype, "ajax");
            view.url = 'view_url';
        });

        it(
            "appends html from views template into dom with given data.",
            function () {
                view.template = 'my_template';
                ajja.register_template('my_template', '<p>{{foo}}</p>');
                view.render({foo: 'bar'});
                expect(view.dom().html()).toEqual('<p>bar</p>');
            }
        );

        it("fetched data from url and calls ajax with viewname.", function () {
            view.render();
            expect(sw.allotmentclub.View.prototype.ajax).toHaveBeenCalledWith(
                'view_url',
                undefined,
                jasmine.any(Function)
            );
        });

        it(
            "fetched data from url and calls ajax with selected year.",
            function () {
                view.dom().append(
                    '<select name="for_year"><option>1983</option></select>'
                );
                view.render();
                expect(
                    sw.allotmentclub.View.prototype.ajax
                ).toHaveBeenCalledWith(
                    jasmine.any(String),
                    {for_year: '1983'},
                    jasmine.any(Function)
                );
            }
        );
    });

    describe("has a function `ajax` that", function () {

        beforeEach(function () {
            spyOn(sw.allotmentclub.View.prototype, "success_handler");
            spyOn(sw.allotmentclub.View.prototype, "error_handler");
            spyOn(sw.allotmentclub, "online").and.returnValue(true);
        });

        it("calls `success_handler` if request was successfull.", function () {
            var callback = jasmine.createSpy();
            spyOn($, "ajax").and.callFake(
                function (e) { e.success('result'); }
            );

            view.ajax('url', null, callback);
            expect(sw.allotmentclub.View.prototype.success_handler)
                .toHaveBeenCalledWith('url', 'result', callback);
            expect(sw.allotmentclub.View.prototype.error_handler)
                .not.toHaveBeenCalled();
        });

        it("calls `error_handler` if request was unsuccessfull.", function () {
            var callback = jasmine.createSpy();
            spyOn($, "ajax").and.callFake(
                function (e) { e.error('xhr', 'status', 'message'); }
            );

            view.ajax('url', null, callback);
            expect(
                sw.allotmentclub.View.prototype.error_handler
            ).toHaveBeenCalledWith(
                'url',
                callback,
                'xhr',
                'status',
                'message'
            );
            expect(sw.allotmentclub.View.prototype.success_handler)
                .not.toHaveBeenCalled();
        });

        describe("handles args and", function () {
            beforeEach(function () {
                spyOn($, "ajax").and.returnValue({foo: 'bar'});
            });

            it("calls $.ajax with given url.", function () {
                view.ajax('url');
                expect($.ajax).toHaveBeenCalledWith({
                    url: 'url',
                    method: 'GET',
                    data: undefined,
                    success: jasmine.any(Function),
                    error: jasmine.any(Function)
                });
            });

            it("can have extra args for the `ajax` call.", function () {
                var callback = jasmine.createSpy();
                view.ajax('url', undefined, callback, {method: 'PUT'});
                expect($.ajax).toHaveBeenCalledWith({
                    url: 'url',
                    method: 'PUT',
                    data: undefined,
                    success: jasmine.any(Function),
                    error: jasmine.any(Function)
                });
            });

            it("makes a POST request if data is given.", function () {
                var callback = jasmine.createSpy();
                view.ajax('url', {foo: 'bar'}, callback);
                expect($.ajax).toHaveBeenCalledWith({
                    url: 'url',
                    method: 'POST',
                    data: {foo: 'bar'},
                    success: jasmine.any(Function),
                    error: jasmine.any(Function)
                });
            });

            it("makes a GET request if year selection is given.", function () {
                var callback = jasmine.createSpy();
                view.ajax('url', {for_year: 2015}, callback);
                expect($.ajax).toHaveBeenCalledWith({
                    url: 'url',
                    method: 'GET',
                    data: {for_year: 2015},
                    success: jasmine.any(Function),
                    error: jasmine.any(Function)
                });
            });

            it(
                "makes a POST request if year selection and data is given.",
                function () {
                    var callback = jasmine.createSpy();
                    view.ajax('url', {for_year: 2015, foo: 'bar'}, callback);
                    expect($.ajax).toHaveBeenCalledWith({
                        url: 'url',
                        method: 'POST',
                        data: {for_year: 2015, foo: 'bar'},
                        success: jasmine.any(Function),
                        error: jasmine.any(Function)
                    });
                }
            );
        });

    });

    describe("has a function `success_handler` that", function () {
        beforeEach(function () {
            spyOn(sw.flashmessage, "warning");
            spyOn(sw.flashmessage, "notify");
            spyOn(sw.allotmentclub.View.prototype, "offline_cache");
        });

        it("does nothing if no data is given.", function () {
            view.success_handler('url');
            expect(sw.flashmessage.warning).not.toHaveBeenCalled();
            expect(sw.flashmessage.notify).not.toHaveBeenCalled();
            expect(
                sw.allotmentclub.View.prototype.offline_cache
            ).not.toHaveBeenCalled();
        });

        it("does calls `offline_cache` if data is given.", function () {
            view.success_handler('url', {});
            expect(
                sw.allotmentclub.View.prototype.offline_cache
            ).toHaveBeenCalledWith('url', {});
        });

        it("does call `warning` if status is `error`.", function () {
            var data = {'status': 'error', 'message': 'Error!'};

            view.success_handler('url', data);
            expect(sw.flashmessage.warning).toHaveBeenCalledWith(
                data.message
            );
            expect(sw.flashmessage.notify).not.toHaveBeenCalled();
            expect(
                sw.allotmentclub.View.prototype.offline_cache
            ).toHaveBeenCalledWith('url', data);
        });

        it("does call `notify` if status is `success`.", function () {
            var data = {'status': 'success', 'message': 'Save successful'};

            view.success_handler('url', data);
            expect(sw.flashmessage.warning).not.toHaveBeenCalled();
            expect(sw.flashmessage.notify).toHaveBeenCalledWith(
                data.message
            );
            expect(
                sw.allotmentclub.View.prototype.offline_cache
            ).toHaveBeenCalledWith('url', data);
        });

        it("does call `callback` if status is `success`.", function () {
            var callback = jasmine.createSpy(),
                data = {'status': 'success', 'data': {foo: 'bar'}};

            view.success_handler('url', data, callback);
            expect(callback).toHaveBeenCalledWith(data.data);
        });

        it(
            "does not call `callback` if status is not `success`.",
            function () {
                var callback = jasmine.createSpy(),
                    data = {'status': 'error', 'data': {foo: 'bar'}};

                view.success_handler('url', data, callback);
                expect(callback).not.toHaveBeenCalled();
            }
        );
    });

    describe("has a function `error_handler` that", function () {
        beforeEach(function () {
            spyOn(sw.allotmentclub, "online");
            spyOn(sw.flashmessage, "error");
            spyOn(sw.allotmentclub.View.prototype, "success_handler");
        });

        it("does show a error message for real errors.", function () {
            view.error_handler('url', null, null, 'error', 'Error!');
            expect(sw.flashmessage.error).toHaveBeenCalledWith('Error!');
            expect(
                sw.allotmentclub.View.prototype.success_handler
            ).not.toHaveBeenCalled();
        });

        it("does read data from offline cache for timeouts.", function () {
            var callback = jasmine.createSpy();

            view.error_handler('url', callback, null, 'timeout');
            expect(sw.flashmessage.error).not.toHaveBeenCalled();
            expect(
                sw.allotmentclub.View.prototype.success_handler
            ).toHaveBeenCalledWith('url', null, callback);
        });

        it("does read data from offline cache for Bad Gateway.", function () {
            var callback = jasmine.createSpy();

            view.error_handler('url', callback, null, 'error', 'Bad Gateway');
            expect(sw.flashmessage.error).not.toHaveBeenCalled();
            expect(
                sw.allotmentclub.View.prototype.success_handler
            ).toHaveBeenCalledWith('url', null, callback);
        });

        it("does set application to offline for timeout.", function () {
            view.error_handler('url', null, null, 'timeout');
            expect(sw.allotmentclub.online).toHaveBeenCalledWith(false);
        });

        it("does set application to offline for Bad Gateway.", function () {
            view.error_handler('url', null, null, 'error', 'Bad Gateway');
            expect(sw.allotmentclub.online).toHaveBeenCalledWith(false);
        });

        it(
            "does not set application to offline for real errors.",
            function () {
                view.error_handler('url', null, null, 'error', 'Error!');
                expect(sw.allotmentclub.online).not.toHaveBeenCalled();
            }
        );
    });

    describe("has a function `offline_handler` that", function () {
        beforeEach(function () {
            spyOn(sw.allotmentclub.View.prototype, "success_handler");
            spyOn(
                sw.allotmentclub.View.prototype,
                "offline_cache"
            ).and.returnValue({foo: 'bar'});
        });

        it(
            "does call `success_handler` with data from `offline_cache`.",
            function () {
                var callback = jasmine.createSpy();

                view.offline_handler({url: 'url'}, callback);
                expect(
                    sw.allotmentclub.View.prototype.success_handler
                ).toHaveBeenCalledWith(
                    null,
                    {foo: 'bar'},
                    callback
                );
            }
        );
    });

    describe("has a function `offline_cache` that", function () {
        beforeEach(function () {
            spyOn(sw.flashmessage, "warning");
        });

        afterEach(function () {
            localStorage.clear();
        });

        it("does set and get data for a url.", function () {
            view.offline_cache('url', {foo: 'bar'});
            expect(view.offline_cache('url')).toEqual({foo: 'bar'});
        });

        it("prints a warning if data is not cached.", function () {
            expect(view.offline_cache('url')).toEqual(null);
            expect(sw.flashmessage.warning).toHaveBeenCalledWith(
                'Offline nicht verfügbar. Seite einmal online laden um sie ' +
                    'offline zur Verfügung zu stellen.'
            );
        });
    });
});
