<template>
  <v-sheet>
    <FullCalendar
      ref="calendar"
      color="primary"
      :event-color="getEventColor"
      :now="today"
      :options="calendarOptions"
      @change="handleChanged"
      @click="handleClick"
    ></FullCalendar>
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      offset-x
    >
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar :color="selectedEvent.color" dark>
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <span v-html="selectedEvent.project?selectedEvent.project:selectedEvent.description"></span>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="secondary" @click="selectedOpen = false">{{title_close}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-sheet>
</template>
<script>
var defaultMethods = {
  getEventColor(event) {
    return event.color;
  },
  showEvent({ nativeEvent, event }) {
    const open = () => {
      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;
      setTimeout(() => (this.selectedOpen = true), 10);
    };

    if (this.selectedOpen) {
      this.selectedOpen = false;
      setTimeout(open, 10);
    } else {
      open();
    }

    nativeEvent.stopPropagation();
  },
  handleClick(event) {
    switch (event.target.parentNode.title)
    {
      case 'Previous month':
      case 'Next month': {
        this.checkEvents();
        break;
      }
    }
  },
  handleChanged(item) {
    const { start, end } = item;
    var _ui_event = {
      id: this.elem.id,
      content: JSON.stringify({
        startTime: new Date(`${start.toLocaleDateString()} 00:00:00`).toISOString().substring(0,19).replace('T', ' '),
        endTime: new Date(`${end.toLocaleDateString()} 23:59:59`).toISOString().substring(0,19).replace('T', ' '),
      })
    };
    window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
  },
  nth(/*d*/) {
    return this.typeToLabel["day"];
    // return d > 3 && d < 21
    //   ? "th"
    //   : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
  },
  rnd(a, b) {
    return Math.floor((b - a + 1) * Math.random()) + a;
  },
  formatDate(a, withTime) {
    return withTime
      ? `${a.getFullYear()}-${a.getMonth() +
          1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
      : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
  },
  convertUtcToLocalTz(dateInUtc) {
    //Convert to local timezone
    return new Date(dateInUtc.getTime() - dateInUtc.getTimezoneOffset()*60*1000);
  },
  getEvents: function() {
    const DATETIME_WITH_TIMEZONE_RULE = /^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T| ](0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])( ?[+-](0[0-9]|1[0-2])\d\d$)/;
    if (this.elem.userData === "") return [];
    else {
      Date.prototype.toLocalISOString = function () {
          function pad(number) { return ('' + number).padStart(2, '0') }
          return `${this.getFullYear()}-${pad(this.getMonth() + 1)}-${pad(this.getDate())}T${pad(this.getHours())}:${pad(this.getMinutes())}:${pad(this.getSeconds())}`
      }
      var _event_list = JSON.parse(this.elem.userData);
      _event_list.forEach((element) => {
        element.title = element.name;
        if (element.start !== undefined && element.start !== '') {
          // if (!element.start.match(DATETIME_WITH_TIMEZONE_RULE)) {
            element.start = new Date(
              element.start.substr(0, 19).replace(' ', 'T') + "Z"
            ).toLocalISOString();
          // }
          // else {
          //   element.start = new Date(
          //     element.start.substr(0, 19).replace(' ', 'T') + element.start.substr(19).replace(' ','')
          //   ).toLocalISOString();
          // }
        }
        if (element.end !== undefined && element.end !== '') {
          if (!element.end.match(DATETIME_WITH_TIMEZONE_RULE)) {
            element.end = new Date(
              element.end.substr(0, 19).replace(' ', 'T') + "Z"
            ).toLocalISOString();
          }
          else {
            element.end = new Date(
              element.end.substr(0, 19).replace(' ', 'T') + element.start.substr(19).replace(' ','')
            ).toLocalISOString();
          }
        }
      });

      return _event_list;
    }
  },
  checkEvents() {
    const calendarRef = this.$refs.calendar;
    let calendarApi = calendarRef.getApi()
    let dates = calendarApi.currentDataManager.state.dateProfile.currentRange
    let _end_time = new Date(dates.end.getTime() - 60*60*24*1000);
    this.handleChanged({start:dates.start, end:_end_time})
  },
}

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import enLocale from '@fullcalendar/core/locales/en-gb';
import twLocale from '@fullcalendar/core/locales/zh-tw';
export default {
  props: {
    elem: Object
  },
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data: () => ({
    title_close: "關閉",
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    //events: [],
    today: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().substring(0, 10),
  }),
  computed: {
    calendarOptions() {
      return {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        plugins: [dayGridPlugin,timeGridPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
        navLinks: true,
        events: this.getEvents(),
        locale: 'en',
        //buttonIcons: false, // show the prev/next text
        dayMaxEvents: true, // allow "more" link when too many events
        // eventsSet: this.checkEvents
      }
    },
  },
  mounted() {
    this.checkEvents();
  },
  methods: defaultMethods,
}
</script>