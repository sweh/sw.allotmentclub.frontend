/*global sw, jQuery, window */
(function ($) {
    "use strict";

    try {
        var AccessAuthorityListView, AccessAuthorityDetailView;

        AccessAuthorityListView = sw.allotmentclub.View.$extend({
            viewname: 'access_authority',
            template: 'access_authority',

            initialize: function (data) {
                $('#navigation_container')
                    .on('activate_node.jstree', function (node, event) {
                        sw.allotmentclub.location.select(
                            'access_authority',
                            event.node.id
                        );
                        sw.allotmentclub.navigation.load_view(
                            'access_authority_detail',
                            window.application_url + '/access_authority/' + event.node.id + '/list',
                            event.node.id
                        );
                    })
                    .jstree({'core': {'data': data}});
            }
        });

        sw.allotmentclub.access_authority_list_view = new AccessAuthorityListView();

        AccessAuthorityDetailView = sw.allotmentclub.TableView.$extend({
            url: '/api/access_authority/{}/list',
            viewname: 'access_authority_detail',
            title: 'Zugriffsberechtigungen',
            is_subview: true
        });
        sw.allotmentclub.access_authority_detail_view = new AccessAuthorityDetailView();

        sw.allotmentclub.access_authority_detail_add = new sw.allotmentclub.AddJSFormView(
            'access_authority_detail_add'
        );

        sw.allotmentclubaccess_authority_detail_edit = new sw.allotmentclub.EditJSFormView(
            'access_authority_detail_edit'
        );

        sw.allotmentclub.access_authority_detail_delete = new sw.allotmentclub.DeleteView(
            'access_authority_detail_delete'
        );

    } catch (e) {
        sw.flashmessage.error(e);
    }

}(jQuery));

