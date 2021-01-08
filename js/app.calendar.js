/*global jQuery, Class, sw, FormData, drawBreadCrumb, window */
/*jslint nomen: true, unparam: true, bitwise: true*/
(function ($) {
    "use strict";

    try {
        var CalendarView;

        CalendarView = sw.allotmentclub.TableView.$extend({
            viewname: 'calendar',
            template: 'calendar',

            init_datatable: function () {
            },

            initialize: function (data) {
                var self = this,
                    hdr = {
                        left: 'title',
                        center: 'month,agendaWeek,agendaDay',
                        right: 'prev,today,next'
                    };
                self.$super(data);
                $('#calendar').fullCalendar({
                    header: hdr,
                    editable: false,
                    droppable: false,
                    firstDay: 1,
                    locale: 'de',
                    axisFormat: 'HH:mm',
                    timeFormat: 'HH:mm',
                    slotLabelFormat: "HH:mm",

                    events: [],
                    eventRender: function (event, element, icon) {
                        if (event.description) {
                            element.find('.fc-title').append(
                                "<br/><span class='ultra-light'>" + event.description + "</span>"
                            );
                        }
                        if (event.owner) {
                            var delete_link = '';
                            if (event.owner === localStorage.getItem('username')) {
                                delete_link = '<a href="" data-id="' + event.id + '" style="color: white"><i class="fa fa-trash-o"></i></a>';
                            }
                            element.find('.fc-title').append(
                                "<br/><span class='ultra-light' style='float: right'>Ersteller: <i>" + event.owner + "</i>&nbsp;&nbsp;" + delete_link + "</span>"
                            );
                            $(element).find('a').click(function (ev) {
                                ev.preventDefault();
                                var evid = $(ev.currentTarget).data('id');
                                var sure = confirm('Termin ' + evid + ' wirklich löschen?');
                                if (!sure) {
                                    return;
                                }
                                var callback = function () {
                                    $("#calendar").fullCalendar('removeEvents', evid);
                                };
                                $.ajax({
                                    url: window.application_url + '/calendar/' + evid + '/delete',
                                    method: 'GET',
                                    success: callback,
                                });
                            });
                        }
                        if (event.icon !== "") {
                            element.find('.fc-title').append("<i class='air air-top-right fa " + event.icon +
                                " '></i>");
                        }
                    },
                    windowResize: function (event, ui) {
                        $('#calendar').fullCalendar('render');
                    }
                });
                /* hide default buttons */
                $('.fc-right, .fc-center').hide();

                $('#calendar-buttons #btn-prev').click(function () {
                    $('.fc-prev-button').click();
                    return false;
                });
                $('#calendar-buttons #btn-next').click(function () {
                    $('.fc-next-button').click();
                    return false;
                });
                $('#calendar-buttons #btn-today').click(function () {
                    $('.fc-today-button').click();
                    return false;
                });
                $('#calendar_show').change(function (ev) {
                  if ($(ev.target).val() === 'Agenda') {
                    $('#calendar').fullCalendar('changeView', 'agendaWeek');
                  } else if ($(ev.target).val() === 'Monat') {
                    $('#calendar').fullCalendar('changeView', 'month');
                  } else {
                    $('#calendar').fullCalendar('changeView', 'agendaDay');
                  }
                });

                $(data.data).each(function(index, item) {
                    var data = {
                        id: item[0].value,
                        category: item[1].value,
                        title: item[2].value,
                        description: item[3].value,
                        allday: item[7].value,
                        start: item[4].value,
                        end: item[5].value,
                        owner: item[8].value,
                    };
                    sw.allotmentclub.add_event(data);
                });
            }

        });

        sw.allotmentclub.calendar = new CalendarView();

        sw.allotmentclub.add_event = function(item) {
            var icon = '';
            var classname = '';
            if (item.category === 'Vorstand') {
                icon = 'fa-lock';
                classname = 'bg-color-red';
            } else if (item.category === 'Mitglieder') {
                icon = 'fa-user';
            } else if (item.category === 'Geburtstage') {
                icon = 'fa-trophy';
                classname = 'bg-color-green';
            }
            $('#calendar').fullCalendar(
                'renderEvent',
                {
                    id: item.id,
                    icon: icon,
                    title: item.title,
                    description: item.description,
                    className: classname,
                    start: item.start,
                    end: item.end,
                    allDay: item.allday,
                    editable: false,
                    owner: item.owner
                },
                true
            );
        };

        sw.allotmentclub.infobrief_download = new sw.allotmentclub.DownloadView(
            'infobrief_print'
        );
    } catch (e) {
        sw.flashmessage.error(e);
    }

}(jQuery));

