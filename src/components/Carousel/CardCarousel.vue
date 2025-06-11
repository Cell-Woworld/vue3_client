<template>
  <v-carousel 
    :cycle="elem.cycle"
    :height="elem.height"
    :interval="!elem.interval?6000:elem.interval"
    :show-arrows="!elem.hideArrows || elem.hideArrows=='false'"
    :show-arrows-on-hover="elem.showArrowsOnHover"
    :hide-delimiters="elem.hideDelimiters"
    :hide-delimiter-background="elem.hideDelimiterBackground"
    light
    :value="elem.value?parseInt(elem.value):0"
    @update:model-value="handleChanged($event)"
  >
    <v-carousel-item 
      v-on:click="handleClick(item,i)"
      v-for="(item, i) in elem.items" 
      :key="i"
    >
      <component
        :is="item.component" v-if="!item.invisible || item.invisible=='false'"
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
        :readonly="item.readonly"
        :items="item.items"
        v-model="item.value"
      >{{item.content}}</component>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
var defaultMethods = {
  handleClick: function (item,index) {
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }

    var _ui_event;
    switch (this.elem.id) {
      default:
        _ui_event = {
          id: this.elem.id,
          content: JSON.stringify({'event':'click', 'content':item.id, 'index': index}),
        };
        window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
        break;
    }
  },
  handleChanged: function (event) {
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }
    let _ui_event = {
      id: this.elem.id,
      content: JSON.stringify({'event':'changed', 'index':event}),
    };
    window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
  },
};

import * as components from 'vuetify/components'
import hRefImg from "@/components/Image/hRefImg.vue";
import List from "@/components/List/List.vue";
import Section from "@/components/Section/Section.vue";
export default {
  name: "Carousel_multi_items",
  components: {
    ...components,
    hRefImg,
    List,
    Section,
  },
  props: {
    elem: Object
  },

  data: () => ({}),
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "CardCarousel") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
  }
};
</script>
