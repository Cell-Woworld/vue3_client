<template>
  <component 
    v-if="!elem.invisible || elem.invisible=='false'"
    :is="elem.subcomponent"
    :style="elem.style"
    :key="elem.id"
    v-model="elem.value"
    :modelValue="elem.value"
    :value="elem.value"
    >
    <v-row style="text-align:left;margin:0px;">{{elem.label}}</v-row>
    <v-row style="text-align:left;margin:0px;" v-if="elem.cols !== undefined && elem.cols > 0">
      <v-col v-for="(item, i) in elem.items" :key="i" :cols="item.cols?item.cols:elem.cols" :style="elem.dense?'padding:0px 2px;':'padding:2px;'">
        <component
          v-if="!item.invisible || item.invisible=='false' || item.invisible == '0'"
          :is="item.component"
          :elem="item"
          :id="item.id"
          :ref="item.id"
          :key="item.id"
          :class="item.class"
          :color="item.color"
          :height="item.height"
          :width="item.width"
          :float="item.float"
          :src="item.src"
          :contain="item.contain"
          :label="item.label"
          :type="item.type"
          :max="item.max"
          :min="item.min"
          :step="item.step"
          :name="item.name"
          :readonly="item.readonly && item.readonly!='false' && item.readonly!='0'"
          :disabled="item.disabled && item.disabled!='false' && item.disabled!='0'"
          :items="item.items"
          :accept="item.accept"
          :multiple="item.multiple"
          :fab="item.fab"
          :icon="item.iconized?item.iconized:item.icon?item.icon:null"
          :dark="item.dark"
          :dense="item.dense"
          :style="item.style"
          :length="item.length"
          v-on:click.once="elem.clickOnce?handleClick(item):null"
          v-on:click="!elem.clickOnce?handleClick(item):null"
          v-on:change="handleChanged(item)"
          v-on:update:model-value="handleChanged(item)"
          v-on:input="handleInput(item)"
          v-model="item.value"
          :modelValue="item.value"
          :value="item.component=='v-checkbox' || item.component=='v-switch'?true:item.value"
          hide-details
          :item-props="itemProps"
          :item-value="item.value"
        >{{translateContent(item)}}</component>
      </v-col>
    </v-row>
    <v-row style="text-align:left;margin:0% 1%;" v-else>
      <v-col v-for="(item, i) in elem.items" :key="i" sm="6" md="4" lg="3" :style="elem.dense?'padding:0px 2px;':'padding:2px;'">
        <component
          v-if="!item.invisible || item.invisible=='false' || item.invisible == '0'"
          :is="item.component"
          :elem="item"
          :id="item.id"
          :ref="item.id"
          :key="item.id"
          :class="item.class"
          :style="item.style"
          :color="item.color"
          :height="item.height"
          :width="item.width"
          :float="item.float"
          :src="item.src"
          :contain="item.contain"
          :label="item.label"
          :type="item.type"
          :max="item.max"
          :min="item.min"
          :step="item.step"
          :name="item.name"
          :readonly="item.readonly && item.readonly!='false' && item.readonly!='0'"
          :disabled="item.disabled && item.disabled!='false' && item.disabled!='0'"
          :items="item.items"
          :accept="item.accept"
          :multiple="item.multiple"
          :fab="item.fab"
          :icon="item.iconized?item.iconized:item.icon?item.icon:null"
          :dark="item.dark"
          :dense="item.dense"
          :length="item.length"
          v-on:click.once="elem.clickOnce?handleClick(item):null"
          v-on:click="!elem.clickOnce?handleClick(item):null"
          v-on:change="handleChanged(item)"
          v-on:update:model-value="item.component=='v-select'||item.component=='v-autocomplete'||item.component=='v-combobox'?handleChanged([item,$event]):null"
          v-on:input="handleInput(item)"
          v-model="item.value"
          :modelValue="item.value"
          :value="item.component=='v-checkbox' || item.component=='v-switch'?true:item.value"
          hide-details
          :item-props="itemProps"
          :item-value="item.value"
        >{{translateContent(item)}}</component>
      </v-col>
    </v-row>
  </component>
</template>

<script>
var defaultMethods = {
  handleClick: function(item) {
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }
    var _ui_event = null;
    switch (item.id) {
      default: {
        _ui_event = {
          id: item.id
        };
        window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
        break;
      }
    }
  },
  handleChanged: function(/*item*/) {
    switch (this.elem.id) {
      default:
        break;
    }
  },
  handleInput: function(/*item*/) {
    switch (this.elem.id) {
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
import DatePicker from "@/components/DatePicker/DatePicker.vue";
import IconButton from "@/components/Button/IconButton.vue";
import SoftButton from "@/components/Button/SoftButton.vue";
import Chip from "@/components/Button/Chip.vue";
import Section_L1 from "@/components/Section/Section_L1.vue";
// import Section_L2 from "@/components/Section/Section_L2.vue";  //used by Editable_DataTable
import hRefImg from "@/components/Image/hRefImg.vue";

export default {
  name: "GridSection",
  components: {
    ...components,
    DatePicker,
    IconButton,
    SoftButton,
    Chip,
    Section_L1,
    // Section_L2,
    hRefImg,
  },
  data: () => ({
    itemList_: {}
  }),
  props: {
    elem: Object
  },
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "GridSection") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
    this.itemList_ = {};
    if (this.elem.value instanceof Object && this.elem.value.constructor === Object) {
      Object.entries(this.elem.value).forEach(([key, value]) => {
        this.$refs[key][0].lazyValue = value;
        this.itemList_[key] = value;
      },this);
    }
    this.elem.items.forEach(element => {
      switch (this.elem.id)
      {
      default:
        // if (element.value === "true" | element.value === "1")
        //   element.value =  true;
        // else if (element.value === "false" | element.value === "0")
        //   element.value =  false;
        if (element.value === true) {
          this.itemList_[element.id] = true;
        }
      }
    }, this);
  }
};
</script>