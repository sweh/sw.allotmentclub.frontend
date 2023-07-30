/*global sw */
(function () {
    "use strict";

    try {
        var AssignmentListView, AssignmentTodoListView, AttendeesListView;

        AssignmentListView = sw.allotmentclub.TableView.$extend({
            viewname: 'assignments',
            title: 'Liste der Arbeitseinsätze',
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.assignments_list_view = new AssignmentListView();

        sw.allotmentclub.assignment_add = new sw.allotmentclub.AddJSFormView(
            'assignment_add'
        );
        sw.allotmentclub.assignment_edit = new sw.allotmentclub.EditJSFormView(
            'assignment_edit'
        );
        sw.allotmentclub.assignment_delete = new sw.allotmentclub.DeleteView(
            'assignment_delete'
        );

        AssignmentTodoListView = sw.allotmentclub.TableView.$extend({
            viewname: 'assignment_todos',
            title: 'Liste der Tätigkeiten',
            default_sort_by: [[2, "asc"]]
        });
        sw.allotmentclub.assignment_todo_list_view = new AssignmentTodoListView();

        sw.allotmentclub.assignment_todo_add = new sw.allotmentclub.AddJSFormView(
            'assignment_todo_add'
        );
        sw.allotmentclub.assignment_todo_edit = new sw.allotmentclub.EditJSFormView(
            'assignment_todo_edit'
        );
        sw.allotmentclub.assignment_todo_delete = new sw.allotmentclub.DeleteView(
            'assignment_todo_delete'
        );

        AttendeesListView = sw.allotmentclub.TableView.$extend({
            viewname: 'assignment_list_attendees',
            title: 'Liste der Teilnehmer des Arbeitseinsatzes',
            is_subview: true,
            default_sort_by: [[1, "asc"]]
        });
        sw.allotmentclub.assignment_attendees_view = new AttendeesListView();

        sw.allotmentclub.assignment_attendees_add = new sw.allotmentclub.AddJSFormView(
            'assignment_attendees_add'
        );

        sw.allotmentclub.assignment_attendees_add = new sw.allotmentclub.EditJSFormView(
            'assignment_attendees_edit'
        );

        sw.allotmentclub.assignment_attendees_delete = new sw.allotmentclub.DeleteView(
            'assignment_attendees_delete'
        );

    } catch (e) {
        sw.flashmessage.error(e);
    }

}());
