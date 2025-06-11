<template>
  <div id="elem.id">
    <v-date-picker
      no-title
      show-current
      v-model="value"
      :color="elem.color"
      :header-color="elem.color"
      :class="elem.class"
      :style="elem.style"
      :full-width="elem.contain"
      :locale="elem.locale"
      :allowed-dates="getAllowedDates"
      :events="getEvents"
      :picker-date.sync="pickerDate"
      v-on:input="datePicked()"
    ></v-date-picker>
  </div>
</template>
<script>
var defaultMethods = {
  convertUtcToLocalTz(dateInUtc) {
    //Convert to local timezone
    return new Date(dateInUtc.getTime() - dateInUtc.getTimezoneOffset()*60*1000);
  },
  formatDate() {
    var _date;
    if (this.elem.value === undefined) {
      _date = this.value;
    }
    else {
      _date = this.elem.value;
    }
    if (isNaN(_date)) {
      var validTime = _date.match(/^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T](0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])($| [+-](0[1-9]|1[0-2])\d\d$)/);
      let validMonth = _date.match(/^\d\d\d\d-(0[1-9]|1[0-2])$/);
      if (validTime) {
        this.date = this.convertUtcToLocalTz(new Date(_date.replace(/-/g, "/").replace("T", " ")));
      } 
      else if (validMonth) {
        this.date = this.convertUtcToLocalTz(new Date(_date.replace(/-/g, "/")+'/01'));
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
    const [year, month, day] = [this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate()];
    this.value = `${year}-${month}-${day}`;
    this.pickerDate = this.value;
    return `${month}/${day}/${year}`;
  },
  datePicked: function() {
    switch (this.elem.id)
    {
    default:
      this.elem.value = this.value;
      break;
    }
  },
  // eslint-disable-next-line no-unused-vars
  monthChanged: function(item) {
    // window.console.log(item);
  },

  // eslint-disable-next-line no-unused-vars
  handleUserData: function(item) {
  },
  // eslint-disable-next-line no-unused-vars
  getAllowedDates: function(item) {
    return [];
  },
  // eslint-disable-next-line no-unused-vars
  getEvents: function(item) {
    return [];
  }
};


export default {
  name: "DatePickerOnly",
  props: {
    elem: Object
  },
  data: () => {
    return {
      value: null,
      pickerDate:null,
      allowedDates: [],
      arrayEvents: []
    };
  },
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "DatePickerOnly") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
    this.formatDate();
    if (this.$root.userData) {
      this.handleUserData(this.$root.userData);
    }
  },
  watch: {
    pickerDate (val) {
      this.monthChanged(val);
    },
  },
};
</script>