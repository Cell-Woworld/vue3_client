<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet>
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="computedEvents"
          :type="type==''?'month':type"
          :locale="elem.locale"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @update:model-value="handleChanged"
        ></v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
var defaultMethods = {
  viewDay({ date }) {
    this.focus = date;
    this.type = "day";
  },
  checkChange(item) {
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
  handleChanged(item) {
    this.checkChange({ start: this.adapter.startOfDay(this.adapter.startOfMonth(item[0])), end: this.adapter.endOfDay(this.adapter.endOfMonth(item[0])) });
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
}

import { VCalendar } from 'vuetify/labs/VCalendar'
import { useDate } from 'vuetify'

export default {
  components: {
    VCalendar,
  },
  props: {
    elem: Object
  },
  data: () => ({
    type: "month",
    events: [],
    focus: [new Date()],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    adapter : useDate(),
  }),
  mounted () {
    this.handleChanged(this.focus);
  },
  computed: {
    computedEvents() {
      const DATETIME_WITH_TIMEZONE_RULE = /^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T| ](0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])( ?[+-](0[0-9]|1[0-2])\d\d$)/;
      if (this.elem.userData === "") return [];
      else {
        Date.prototype.toLocalISOString = function () {
            function pad(number) { return ('' + number).padStart(2, '0') }
            return `${this.getFullYear()}-${pad(this.getMonth() + 1)}-${pad(this.getDate())}T${pad(this.getHours())}:${pad(this.getMinutes())}:${pad(this.getSeconds())}`
        }
        var _event_list = JSON.parse(this.elem.userData);
        _event_list.forEach((element) => {
          if (element.start !== undefined && element.start !== '') {
            if (!element.start.match(DATETIME_WITH_TIMEZONE_RULE)) {
              // element.start = new Date(element.start.substr(0, 19).replace(' ', 'T') + "Z").toLocalISOString();
              element.start = new Date(element.start.substr(0, 19).replace(' ', 'T') + "Z");
            }
            else {
              // element.start = new Date(element.start.substr(0, 19).replace(' ', 'T') + element.start.substr(19).replace(' ','')).toLocalISOString();
              element.start = new Date(element.start.substr(0, 19).replace(' ', 'T') + element.start.substr(19).replace(' ',''));
            }
          }
          if (element.end !== undefined && element.end !== '') {
            if (!element.end.match(DATETIME_WITH_TIMEZONE_RULE)) {
              // element.end = new Date(element.end.substr(0, 19).replace(' ', 'T') + "Z").toLocalISOString();
              element.end = new Date(element.end.substr(0, 19).replace(' ', 'T') + "Z");
            }
            else {
              // element.end = new Date(element.end.substr(0, 19).replace(' ', 'T') + element.start.substr(19).replace(' ','')).toLocalISOString();
              element.end = new Date(element.end.substr(0, 19).replace(' ', 'T') + element.start.substr(19).replace(' ',''));
            }
          }
          element.title=element.name;
        });

        return _event_list;
      }
    },
    isMobile() {
      return this.checkMobile();
    },
  },
  methods: defaultMethods,
}
</script>