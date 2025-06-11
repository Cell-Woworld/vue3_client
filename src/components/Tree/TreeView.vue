<template>
  <div>
    <v-text-field v-show='!elem.treeView.noSearch'
      v-model="search"
      :label="elem.label"
      style="margin:0px 3%;"
      flat
      solo-inverted
      hide-details
      clearable
      clear-icon="mdi-close-circle-outline"
    ></v-text-field>
    <v-treeview :key="elem.id"           
      v-model="computedValue"
      :open-all="elem.treeView.openAll"
      :selectable="elem.treeView.selectable"
      :selection-type="selectionType"
      :items="elem.items"
      :search="search"
      :filter="filter"
      activatable
      item-text="content"
      item-key="id"
      item-children="items"
      item-disabled="disabled"
      open-on-click
      hoverable
      dense
      @update:active="handleClick($event)"
      @input="handleChanged($event)"
    >
      <template v-slot:prepend="{ item, open }">
        <component :is="attachedItem.component" v-for="attachedItem in item.prepend"
          v-show="!attachedItem.invisible || attachedItem.invisible=='false'"
          :elem="attachedItem"
          :id="attachedItem.id"
          :ref="attachedItem.id"
          :key="attachedItem.id"
          :class="attachedItem.class"
          :style="attachedItem.style"
          :color="attachedItem.color"
          :height="attachedItem.height"
          :width="attachedItem.width"
          :float="attachedItem.float"
          :src="attachedItem.src"
          :contain="attachedItem.contain"
          :label="attachedItem.label"
          :type="attachedItem.type"
          :max="attachedItem.max"
          :min="attachedItem.min"
          :step="attachedItem.step"
          :value="attachedItem.value"
          :name="attachedItem.name"
          :readonly="attachedItem.readonly"
          :attachedItems="attachedItem.attachedItems"
          :accept="attachedItem.accept"
          :multiple="attachedItem.multiple"
          :fab="attachedItem.fab"
          :icon="attachedItem.iconized?attachedItem.iconized:attachedItem.icon?attachedItem.icon:null"
          v-on:click.once="elem.clickOnce?handleClick(attachedItem):null"
          v-on:click.stop="!elem.clickOnce?handleClick(attachedItem):null"
          v-on:change="handleChanged(attachedItem)"
          v-model="attachedItem.value"
        >
          {{translateContent(attachedItem, open)}}
        </component>
      </template>
      <template v-slot:append="{ item }">
        <component :is="attachedItem.component" v-for="attachedItem in item.append"
          v-show="!attachedItem.invisible || attachedItem.invisible=='false'"
          :elem="attachedItem"
          :id="attachedItem.id"
          :ref="attachedItem.id"
          :key="attachedItem.id"
          :class="attachedItem.class"
          :style="attachedItem.style"
          :color="attachedItem.color"
          :height="attachedItem.height"
          :width="attachedItem.width"
          :float="attachedItem.float"
          :src="attachedItem.src"
          :contain="attachedItem.contain"
          :label="attachedItem.label"
          :type="attachedItem.type"
          :max="attachedItem.max"
          :min="attachedItem.min"
          :step="attachedItem.step"
          :value="attachedItem.value"
          :name="attachedItem.name"
          :readonly="attachedItem.readonly"
          :attachedItems="attachedItem.attachedItems"
          :accept="attachedItem.accept"
          :multiple="attachedItem.multiple"
          :fab="attachedItem.fab"
          :icon="attachedItem.iconized"
          v-on:click.once="elem.clickOnce?handleClick(attachedItem):null"
          v-on:click.stop="!elem.clickOnce?handleClick(attachedItem):null"
          v-on:change="handleChanged(attachedItem)"
          v-model="attachedItem.value"
        >
          {{translateContent(attachedItem)}}
        </component>
      </template>
    </v-treeview>
  </div>
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
  // eslint-disable-next-line no-unused-vars
  handleUserData: function(item) {
  },
  translateContent: function(item, open) {
    try {
      let _content = JSON.parse(item.content);
      return open ? _content.open : _content.close;
    }
    catch {
      return item.content;
    }
  },
  theSameArray: function(a1, a2) {
    if (!Array.isArray(a1) || !Array.isArray(a2))
    {
      return false;
    }
    let _a1 = Array.from(a1);
    let _a2 = Array.from(a2);
    _a1.sort();
    _a2.sort();
    return _a1.length==_a2.length && _a1.every((v,i)=> v === _a2[i]);
  },
};

import {
  VBtn,
  VImg,
  VTextField,
  VIcon,
  VSelect,
  VSwitch,
  VCheckbox,
  VCardActions,
  VListItem,
  VListItemTitle,
  VListItemSubtitle,
  // VListItemAvatar,
  // VListItemContent,
  VContainer,
  VRadioGroup,
  VRadio
} from "vuetify/lib/components/index";
export default {
  name: "TreeView",
  components: {
    VBtn,
    VImg,
    VTextField,
    VIcon,
    VSelect,
    VSwitch,
    VCheckbox,
    VCardActions,
    VListItem,
    VListItemTitle,
    VListItemSubtitle,
    // VListItemAvatar,
    // VListItemContent,
    VContainer,
    VRadioGroup,
    VRadio,
  },
  data: () => ({
    value: [],
    search: null,
    selectionType: 'leaf'
  }),
  props: {
    elem: Object,
  },
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "TreeView") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
    if (this.$root.userData) {
      this.handleUserData(this.$root.userData);
    }
    // if (this.elem.value) {
    //   this.value = this.elem.value;
    // }
  },
  computed: {
    filter () {
      return this.elem.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
    },
    computedValue: {
      get() {
        return this.elem.value && typeof this.elem.value==='string'?JSON.parse(this.elem.value):(Array.isArray(this.elem.value)?this.elem.value:[]);
      },
      // set(value) {this.elem.value = value}
      set() {}
    }
  },
};
</script>