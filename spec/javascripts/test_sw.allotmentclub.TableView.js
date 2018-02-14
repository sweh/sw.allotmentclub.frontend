/*global describe, document, $, gocept, sw, jasmine, beforeEach, it, expect */
/*global waits, runs, waitsFor, afterEach, spyOn, Handlebars, localStorage */
/*jslint nomen: true, unparam: true, bitwise: true*/

describe("sw.allotmentclub.TableView", function () {
    "use strict";

    var view,
        table_data = {
            "header": [
                {"name": "#"},
                {"name": "Dateiname"},
                {"name": "Dateityp"}],
            "data": [
                [
                    {"value": 0},
                    {"value": "Protokoll Jahresversammlung.pdf"},
                    {"value": "PDF"}
                ],
                [
                    {"value": 1},
                    {"value": "Beitritt.pdf"},
                    {"css_class": "", "value": "PDF"}
                ]
            ],
            "actions": [
                {"url": "/depots/add", "route": "depot_add", "title": "Neu"},
                {"url": "/depots/{id}/edit", "route": "depot_edit", "title": "Bearbeiten"}
            ],
            "years": [{"year": 2014}, {"selected": "selected", "year": 2015}, {"year": 2016}],
            "records": 2
        };

    beforeEach(function () {
        $('body').append($('<div id="main_content"></div>'));
        $('body').append($('<div id="sub_content"></div>'));
        view = new sw.allotmentclub.TableView('my_view');
    });

    afterEach(function () {
        $('#main_content').remove();
        $('#sub_content').remove();
    });

    describe("has a function `initialize_actions` that", function () {

        beforeEach(function () {
            spyOn(sw.allotmentclub.View.prototype, "render");
            spyOn(sw.allotmentclub.location, "select");
            spyOn(sw.allotmentclub.navigation, "click_handler");
        });

        it("initializes call to render if year is switched.", function () {
            view.dom().append(
                '<select name="for_year"></select>'
            );
            view.initialize_actions();
            expect(sw.allotmentclub.View.prototype.render).not.toHaveBeenCalled();
            view.dom().find('select[name="for_year"]').change();
            expect(sw.allotmentclub.View.prototype.render).toHaveBeenCalled();
        });

        it(
            "doesnt disable actions if they dont need a highlighted row.",
            function () {
                view.dom().append(
                    '<p class="actions"><a data-url="/foo">Link</a></p>'
                );
                view.initialize_actions();
                expect(view.dom().find('a').hasClass('disabled')).toEqual(false);
            }
        );

        it("disables actions that call a subview.", function () {
            // This makes sure that user must click a row in table to activate
            // button.
            view.dom().append(
                '<p class="actions"><a data-url="{id}">Link</a></p>'
            );
            view.initialize_actions();
            expect(view.dom().find('a').hasClass('disabled')).toEqual(true);
        });

        it(
            "disables actions that on a subview that call a subsubview.",
            function () {
                view.is_subview = true;
                view.dom().append(
                    '<p class="actions"><a data-url="{id}/{sub_id}">Link</a></p>'
                );
                view.initialize_actions();
                expect(view.dom().find('a').hasClass('disabled')).toEqual(true);
            }
        );

        it(
            "removes disabled from action if table row is selected.",
            function () {
                view.dom().append(
                    '<table><tbody><tr><td>42</td></tr></tbody></table>' +
                        '<p class="actions"><a data-url="/foo">Link</a></p>'
                );
                view.initialize_actions();
                view.dom().find('td').click();
                expect(
                    sw.allotmentclub.location.select
                ).toHaveBeenCalledWith('my_view', '42');
                expect(view.dom().find('tr').hasClass('danger')).toEqual(true);
                expect(view.dom().find('a').hasClass('disabled')).toEqual(false);
            }
        );
        it(
            "does call click handler on click on action.",
            function () {
                view.dom().append(
                    '<p class="actions"><a data-url="/foo">Link</a></p>'
                );
                view.initialize_actions();
                view.dom().find('a').click();
                expect(
                    sw.allotmentclub.navigation.click_handler
                ).toHaveBeenCalledWith(jasmine.any(Object));
            }
        );
    });

    describe("has a function `render` that", function () {

        beforeEach(function () {
            spyOn(sw.allotmentclub.location, "select");
            spyOn(sw.allotmentclub.navigation, "click_handler");
            view.url = '/table';
        });

        it("renders data as a datatables table.", function () {
            view.render(table_data);
            var html = view.dom().html();
            expect(html).toContain(
                '<td class="">Protokoll Jahresversammlung.pdf</td>'
            );
            expect(html).toContain('1 bis 2 von 2 Einträgen');
        });

        it("allows to switch pages.", function () {
            view.page_length = 1;
            view.render(table_data);
            expect(view.dom().html()).not.toContain(
                '<td class="">Beitritt.pdf</td>'
            );
            expect(view.dom().html()).toContain('1 bis 1 von 2 Einträgen');
            view.dom().find('.paginate_button.next a').click();
            expect(view.dom().html()).toContain(
                '<td class="">Beitritt.pdf</td>'
            );
            expect(view.dom().html()).toContain('2 bis 2 von 2 Einträgen');
        });

        it("allows to filter for text.", function () {
            view.render(table_data);
            expect(view.dom().html()).toContain(
                '<td class="">Protokoll Jahresversammlung.pdf</td>'
            );
            view.dom().find('input[type=search]').val('Beitritt').keyup();
            expect(view.dom().html()).not.toContain(
                '<td class="">Protokoll Jahresversammlung.pdf</td>'
            );
            expect(view.dom().html()).toContain(
                '<td class="">Beitritt.pdf</td>'
            );
        });

        it("renders year switch", function () {
            view.render(table_data);
            expect(
                view.dom().find('select[name="for_year"] option').text()
            ).toEqual('201420152016');
        });
    });
});
