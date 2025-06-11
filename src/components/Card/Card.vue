<template>
  <v-card 
    :color="elem.color" 
    :key="elem.alt?elem.alt:elem.id" 
    :style="elem.style"
    :flat="elem.flat"
    :elevation="elem.elevation"
  >
    <component :is="item.component" v-for="item in elem.items"
      v-show="!item.invisible || item.invisible=='false'"
      :elem="item"
      :id="item.id"
      :ref="item.id"
      :key="item.id"
      :class="item.class"
      :style="item.style"
      :color="item.color"
      :height="item.height"
      :width="item.width"
      :size="item.size"
      :float="item.float"
      :src="item.src"
      :contain="item.contain"
      :label="item.label"
      :type="item.type"
      :max="item.max"
      :min="item.min"
      :step="item.step"
      :name="item.name"
      :readonly="item.readonly"
      :items="item.items"
      :accept="item.accept"
      :multiple="item.multiple"
      :fab="item.fab"
      :icon="item.iconized?item.iconized:item.icon?item.icon:null"
      :dark="item.dark"
      :dense="item.dense"
      :length="item.length"
      v-on:click="handleClick(item)"
      v-on:change="handleChanged(item)"
      v-model="item.value"
      :value="item.value"
      :modelValue="item.value"
      hide-details
      :item-props="itemProps"
      :item-value="item.value"
    >{{translateContent(item)}}</component>
  </v-card>
</template>

<script>
var defaultMethods = {
  handleClick: function (item) {
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }

    var _ui_event;
    switch (item.id) {
      default:
        _ui_event = {
          id: item.id,
        };
        window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
        break;
    }
  },
  handleChanged: function (item) {
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }
    // var _ui_event;
    switch (item.id) {
      default:
        break;
    }
  },
  translateContent: function(item) {
    const DATETIME_RULE = /^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T ](0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])($|Z$| [+-](0[0-9]|1[0-2])\d\d$)/;
    var _content = item.content;
    var _value = item.value;
    if (/^\w*([Dd]ate)(_?)([Tt]ime)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validTime = element.match(DATETIME_RULE);
        if (validTime) {
          _content += new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z').toLocaleString().slice(0,-3);
        }
        else {
          _content += element;
        }
      });
      if (item.value && item.value.includes('#') > 0) {
        _value = '';
        item.value.split('#').forEach(element => {
          let validTime = element.match(DATETIME_RULE);
          if (validTime) {
            _value += new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z').toLocaleString().slice(0,-3);
          }
          else {
            _value += element;
          }
        });
        item.value = _value;
      }
    }
    else if (/^\w*([Tt]ime)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validTime = element.match(DATETIME_RULE);
        if (validTime) {
          _content += new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z').toLocaleTimeString('en-GB').slice(0,-3);
        }
        else {
          _content += element;
        }
      });
      if (item.value && item.value.includes('#') > 0) {
        _value = '';
        item.value.split('#').forEach(element => {
          let validTime = element.match(DATETIME_RULE);
          if (validTime) {
            _value += new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z').toLocaleTimeString('en-GB').slice(0,-3);
          }
          else {
            _value += element;
          }
        });
        item.value = _value;
      }
    }
    else if (/^\w*([Dd]ate)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
      let validTime = element.match(DATETIME_RULE);
        if (validTime) {
          let _datetime = new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z');
          const [year, month, day] = [_datetime.getFullYear(), _datetime.getMonth() + 1, _datetime.getDate()];
          _content += `${year}/${month}/${day}`;
        }
        else {
          _content += element;
        }
      });
      if (item.value && item.value.includes('#') > 0) {
        _value = '';
        item.value.split('#').forEach(element => {
        let validTime = element.match(DATETIME_RULE);
          if (validTime) {
            let _datetime = new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z');
            const [year, month, day] = [_datetime.getFullYear(), _datetime.getMonth() + 1, _datetime.getDate()];
            _value += `${year}/${month}/${day}`;
          }
          else {
            _value += element;
          }
        });
        item.value = _value;
      }
    }
    else if (/^\w*([Nn]umber)(_?)([Dd]ouble)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validNumber = element.match(/^-?\d+\.?\d*$/);
        if (validNumber) {
          _content += (Math.round(parseFloat(element) * 100) / 100).toFixed(2);
        }
        else {
          _content += element;
        }
      });
      if (item.value && item.value.includes('#') > 0) {
        _value = '';
        item.value.split('#').forEach(element => {
          let validNumber = element.match(/^-?\d+\.?\d*$/);
          if (validNumber) {
            _value += Math.round(parseFloat(element) * 100) / 100;
          }
          else {
            _value += element;
          }
        });
        item.value = _value;
      }
    }
    else if (/^\w*([Dd]iscount|[Pp]ercent)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validNumber = element.match(/^-?\d+\.?\d*$/);
        if (validNumber) {
          _content += (Math.round(parseFloat(element) * 10000) / 100).toFixed(2) + '%';
        }
        else {
          _content += element;
        }
      });
    }
    else if (/^\w*([Nn]umber)(_?)([Ii]nteger)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validNumber = element.match(/^-?\d+\.?\d*$/);
        if (validNumber) {
          _content += Math.round(parseFloat(element));
        }
        else {
          _content += element;
        }
      });
    }
    else if (/^\w*([Pp]ad[Ii]nteger8)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validNumber = element.match(/^-?\d+\.?\d*$/);
        if (validNumber) {
          _content += Math.round(parseFloat(element)).toString().padStart(8,0);
        }
        else {
          _content += element;
        }
      });
    }
    else if (/^\w*(JSON|json)2([Ll]ist)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        try {
          let _listInJSON = JSON.parse(element);
          Object.entries(_listInJSON).forEach(([key, value]) => {
            if (value)
              _content += key + ' ';
          });
        }
        catch {
          _content += element;
        }
      });
    }
    return _content;
  },
  itemProps: function(item) {
    return {
      title: item.text,
      value: item.value,
    }
  },
};

import * as components from 'vuetify/components'
import Section from "@/components/Section/Section.vue";
import Section_L2 from "@/components/Section/Section_L2.vue";
import GridSection from "@/components/Section/GridSection.vue";
import DatePicker from "@/components/DatePicker/DatePicker.vue";
import DataTable from "@/components/DataTable/DataTable.vue";
import LabelledDataTable from "@/components/DataTable/LabelledDataTable.vue";
import Editable_DataTable from "@/components/DataTable/Editable_DataTable.vue";
import YesNoWithDescription from "@/components/Question/YesNoWithDescription.vue";
import IconButton from "@/components/Button/IconButton.vue";
// import Dialog from "@/components/Dialog/Dialog.vue";
import CardList from "@/components/List/CardList.vue";
import CardCarousel from "@/components/Carousel/CardCarousel.vue";
import ExpansionList from "@/components/List/ExpansionList.vue";
import MenuToggleButton from "@/components/Button/MenuToggleButton.vue";

export default {
  components: {
    ...components,
    Section,
    Section_L2,
    GridSection,
    DatePicker,
    DataTable,
    LabelledDataTable,
    Editable_DataTable,
    YesNoWithDescription,
    IconButton,
    // Dialog,
    CardList,
    CardCarousel,
    ExpansionList,
    MenuToggleButton,
  },
  props: {
    elem: Object
  },
  data: () => ({
  }),
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "Card") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
  }
};
</script>

<style scoped>
</style>