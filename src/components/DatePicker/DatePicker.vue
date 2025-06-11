<template>
  <div id="elem.id">
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="date"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ props }">
        <v-text-field
          v-model="computedDateFormatted"
          v-bind="props"
          :readonly="elem.readonly"
          :class="elem.class"
          :label="elem.label"
          :visible="!elem.invisible || elem.invisible=='false'"
          :color="elem.color"
          :disabled="elem.disabled && (elem.disabled==true || elem.disabled=='true')?true:false"
          :dark="elem.dark"
          hide-details
          style="padding:0px;margin:0px;"
        ></v-text-field>
      </template>
      <v-date-picker
        @update:model-value="handleChanged"
        :color="elem.color"
        :min="min"
        :max="max"
        :type="elem.type?elem.type:'date'"
        :disabled="elem.disabled && (elem.disabled==true || elem.disabled=='true')?true:false"
        show-adjacent-months
        hide-actions
      >
        <template v-slot:title></template>
        <template v-slot:header></template>
      </v-date-picker>
    </v-menu>
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
      let validTime = _date.match(/^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T ](0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])($| [+-](0[1-9]|1[0-2])\d\d$)/);
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
    if (this.elem.type == "month")
    {
      this.elem.value = this.value = `${year}-${String(month).padStart(2,'0')}-01`;
      this.pickerDate = this.value;
      return `${month}/${year}`;
    }
    else
    {
      this.elem.value = this.value = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      this.pickerDate = this.value;
      return `${month}/${day}/${year}`;
    }
  },
  handleChanged: function(newValue) {
    this.menu = false; this.datePicked(newValue);
  },
  datePicked: function(newValue) {
    if (newValue) {
      this.date = newValue;
      const [year, month, day] = [
        newValue.getFullYear(), 
        (newValue.getMonth() + 1).toString().padStart(2, "0"), 
        (newValue.getDate()).toString().padStart(2, "0")
      ];
      this.elem.value = this.value = `${year}-${month}-${day}`;
    } else {
      this.elem.value = this.value;
    }
    this.$emit('click');
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
}

export default {
  name: "DatePicker",
  props: {
    elem: Object
  },
  data: () => {
    return {
      value: null,
      date:null,
      min:null,
      max:null,
      menu: false,
      config: null,
    };
  },
  computed: {
    computedDateFormatted: {
      get() {
        return this.formatDate();
      },
      set() {}
    }
  },
  methods: defaultMethods,
  mounted() {
    this.datePicked();
    if (this.elem.max >= this.elem.min && (this.elem.min != 0 || this.elem.max != 0)) {
      let _checkList = [this.elem.min, this.elem.max];
      _checkList.forEach((element,i,array) => {
        if (array[i] !== undefined) {
          if (isNaN(array[i])) {
            var validTime = array[i].match(/^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T| ](0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])($| [+-](0[1-9]|1[0-2])\d\d$)/);
            if (validTime) {
              array[i] = new Date(array[i]);
            } 
            else {
              array[i] = new Date(array[i].replace(/-/g, "/"));
            }
          }
          else if (isNaN(parseInt(array[i])) == false) {
            array[i] = new Date(Date.now()+array[i]*86400000);
          }
          if (array[i]) {
            const [year, month, day] = [
              array[i].getFullYear(), 
              (array[i].getMonth() + 1).toString().padStart(2, "0"), 
              (array[i].getDate()).toString().padStart(2, "0")
            ];
            array[i] = `${year}-${month}-${day}`;
          }
        }
      });
      this.min = _checkList[0];
      this.max = _checkList[1];
    }
  },
};
</script>