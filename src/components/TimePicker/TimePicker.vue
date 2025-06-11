<template>
  <div id="elem.id">
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="time"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ props }">
        <v-text-field
          v-model="computedTimeFormatted"
          v-bind="props"
          :readonly="elem.readonly"
          :class="elem.class"
          :label="elem.label"
          :visible="!elem.invisible"
          :color="elem.color"
          :disabled="elem.disabled && (elem.disabled==true || elem.disabled=='true')?true:false"
          :dark="elem.dark"
          hide-details
          style="padding:0px;margin:0px;"
        ></v-text-field>
      </template>
      <v-time-picker
        v-model="value"
        :color="elem.color"
        :header-color="elem.color"
        :allowed-minutes = "elem.step?m => m % elem.step === 0:null"
        format="24hr"
        @click:minute="$refs.menu.save(elem.value)"
        :min="Math.floor(elem.min/60) + ':' + parseInt(elem.min)%60 + ':00'"
        :max="Math.floor(elem.max/60) + ':' + parseInt(elem.max)%60 + ':00'"
      ></v-time-picker>
    </v-menu>
  </div>
</template>
<script>
var defaultMethods = {
  convertUtcToLocalTz(dateInUtc) {
    //Convert to local timezone
    return new Date(dateInUtc.getTime() - dateInUtc.getTimezoneOffset()*60*1000);
  },
  formatTime() {
    var _date;
    if (this.elem.value === undefined) {
      _date = this.value;
    }
    else {
      _date = this.elem.value;
    }
    if (isNaN(_date)) {
      let validTime = _date.match(/^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T ](0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])($| [+-](0[1-9]|1[0-2])\d\d$)/);
      if (validTime) {
        this.date = this.convertUtcToLocalTz(new Date(_date.replace(/-/g, "/").replace("T", " ")));
      } 
      else {
        this.date = this.convertUtcToLocalTz(new Date(_date.replace(/-/g, "/")));
      }
    }
    else if (isNaN(parseInt(_date)) == false) {
      this.date = new Date(Date.now()+_date*86400000);
    }
    else if (typeof _date !== 'boolean') {  //this.elem.value has been overwritten as a boolean value for unknown reasons, ignore it!
      this.date = new Date();
    }
    const [hour, minute, second] = [this.date.getHours(), this.date.getMinutes(), this.date.getSeconds()];
    this.elem.value = this.value = `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')}`;
    this.pickerTime = this.value;
    return `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
  },
  timePicked: function() {
    switch (this.elem.id)
    {
    default: {
        // const [year,month,day] = this.value.split('-');
        // this.elem.value = `${year-this.yearOffset}-${month}-${day}`;
        this.elem.value = this.value;
        break;
      }
    }
  },

  // eslint-disable-next-line no-unused-vars
  handleUserData: function(item) {
  },
  // eslint-disable-next-line no-unused-vars
  getEvents: function(item) {
    return [];
  },
}

import { VTimePicker } from 'vuetify/labs/VTimePicker'
export default {
  name: "TimePicker",
  components: {
    VTimePicker,
  },
  props: {
    elem: Object
  },
  data: () => {
    return {
      value: null,
      time:null,
      min:null,
      max:null,
      menu: false,
    };
  },
  computed: {
    computedTimeFormatted: {
      get() {
        return this.formatTime();
      },
      set() {}
    }
  },
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "TimePicker") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
    if (this.$root.userData) {
      this.handleUserData(this.$root.userData);
    }
  },
};
</script>