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
    <!-- <tree-view  id="my-tree" :initial-model="dataModel"></tree-view> -->
    <tree-view :key="elem.id"           
      v-model="computedValue"
      :style="elem.style"
      :open-all="elem.treeView.openAll"
      :selectable="elem.treeView.selectable"
      :initial-model="computedItems"
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
      @click.stop="handleClick($event)"
      @update:active="handleClick($event)"
      @input="handleChanged($event)"
    >
    <!-- :selection-type="selectionType" -->
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
    </tree-view>
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
  retrieveData: function(elemList) {
    let _elemList = elemList;
    if (_elemList.length > 0) {
      _elemList.forEach((value,index,array) => {
        array[index]['label']=value.content;
        array[index]['treeNodeSpec']={
          selectable:this.elem.treeView.selectable,
          input:{
            type:'checkbox',name:value.content
          },
          customizations: {
            classes: {
              treeViewNodeSelfExpander: 'fa fa-chevron-right',
              treeViewNodeSelfExpanded: 'fa fa-chevron-down',
            }
          },
        };
        array[index]['children']=this.retrieveData(value.items);
      })
    }
    return _elemList;
  },
};

import * as components from 'vuetify/components'
import { TreeView } from "@grapoza/vue-tree"
export default {
  name: "grapozaTreeView",
  components: {
    ...components,
    TreeView,
  },
  // data: () => ({
  //   value: [],
  //   search: null,
  //   selectionType: 'leaf'
  // }),
  data() {
    return {
      search: null,
      dataModel: [
        {
          id: "numberOrString",
          label: "Root Node",
          children: [
            {id: 1, label: "Child Node"},
            {id: "node2", label: "Second Child"}
          ]
        }
      ]
    }
  },
  props: {
    elem: Object,
  },
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "grapozaTreeView") {
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
    },
    computedItems() {
      return this.retrieveData(this.elem.items)
    },
  },
};
</script>

<style>
@import '@grapoza/vue-tree/css';
</style>
