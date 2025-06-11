<template>
  <v-expansion-panels
    :id="elem.id"
    :ref="elem.id"
    :key="elem.alt?elem.alt:elem.id" 
    :style="elem.style"
    :disabled="elem.disabled"
    v-model="elem.value"
    :modelValue="parseInt(elem.value)"
    focusable
  >
    <v-expansion-panel 
      v-for="(item, i) in elem.items"
      :id="'panel_' + item.id"
      :ref="'panel_' + item.id"
      :key="'panel_' + i"
      v-on:click="handleClick(item)"
    >
      <v-expansion-panel-title :style="item.style">
        <template v-slot:default="{ open }">
          <v-row no-gutters>
            <v-col :cols="item.cols">
              <component :is="prependItem.component" v-for="prependItem in item.prepend"
                v-show="!prependItem.invisible || prependItem.invisible=='false' || prependItem.invisible == '0'"
                :elem="prependItem"
                :id="prependItem.id"
                :ref="prependItem.id"
                :key="prependItem.id"
                :class="prependItem.class"
                :style="prependItem.style"
                :color="prependItem.color"
                :height="prependItem.height"
                :width="prependItem.width"
                :float="prependItem.float"
                :src="prependItem.src"
                :alt="prependItem.alt"
                :contain="prependItem.contain"
                :label="prependItem.label"
                :type="prependItem.type"
                :max="prependItem.max"
                :min="prependItem.min"
                :step="prependItem.step"
                :name="prependItem.name"
                :readonly="prependItem.readonly && prependItem.readonly!='false' && prependItem.readonly!='0'"
                :disabled="prependItem.disabled && prependItem.disabled!='false' && prependItem.disabled!='0'"
                :items="prependItem.items"
                :accept="prependItem.accept"
                :multiple="prependItem.multiple"
                :fab="prependItem.fab"
                :icon="prependItem.icon"
                :dark="prependItem.dark"
                :dense="prependItem.dense"
                :length="prependItem.length"
                :size="prependItem.size"
                v-on:change="handleChanged(prependItem)"
                v-on:input="handleInput(prependItem)"
                v-model="prependItem.value"
                :modelValue="prependItem.value"
                hide-details
              >{{prependItem.content}}</component>
            </v-col>
            <v-col
              :cols="12-item.cols"
              class="text--secondary"
            >
              <v-fade-transition group leave-absolute>
                <span v-if="item.prepend" key="0" style="font-weight:bold;vertical-align:-webkit-baseline-middle;">{{item.label}}</span>
                <div v-if="item.value==true || item.value=='true'" key="1" style="font-size:small;float:right;">
                  <component :is="appendItem.component" v-for="appendItem in item.append"
                    v-show="!appendItem.invisible || appendItem.invisible=='false' || appendItem.invisible == '0'"
                    :elem="appendItem"
                    :id="appendItem.id"
                    :ref="appendItem.id"
                    :key="appendItem.id"
                    :class="appendItem.class"
                    :style="appendItem.style"
                    :color="appendItem.color"
                    :height="appendItem.height"
                    :width="appendItem.width"
                    :float="appendItem.float"
                    :src="appendItem.src"
                    :alt="appendItem.alt"
                    :contain="appendItem.contain"
                    :label="appendItem.label"
                    :type="appendItem.type"
                    :max="appendItem.max"
                    :min="appendItem.min"
                    :step="appendItem.step"
                    :name="appendItem.name"
                    :readonly="appendItem.readonly && appendItem.readonly!='false' && appendItem.readonly!='0'"
                    :disabled="appendItem.disabled && appendItem.disabled!='false' && appendItem.disabled!='0'"
                    :items="appendItem.items"
                    :accept="appendItem.accept"
                    :multiple="appendItem.multiple"
                    :fab="appendItem.fab"
                    :icon="appendItem.icon"
                    :dark="appendItem.dark"
                    :dense="appendItem.dense"
                    :length="appendItem.length"
                    v-on:change="handleChanged(iteappendItemm)"
                    v-on:input="handleInput(appendItem)"
                    v-model="appendItem.value"
                    :modelValue="appendItem.value"
                    :size="appendItem.size"
                    hide-details
                  >{{appendItem.content}}</component>
                </div>
                <span v-if="open" key="2" style="clear:both;text-align:left;;font-size:small;display:block;margin-top:3px;">{{item.content}}
                </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
          <component :is="item.component" 
            :elem="item" 
            :id="item.id" 
            :ref="item.id" 
            :key="item.key"
            :items="item.items"
          />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
var defaultMethods = {
  // eslint-disable-next-line no-unused-vars
  handleClick: function (item) {
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }
    switch (item.id) {
      default:
        break;
    }
  },
};

import * as components from 'vuetify/components'
import Section from "@/components/Section/Section.vue";
import Section_L2 from "@/components/Section/Section_L2.vue";
export default {
  props: {
    elem: Object
  },
  components: {
    ...components,
    Section,
    Section_L2,
  },
  data: () => ({
    // itemList_: {},
    message: null,
  }),
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "ExpansionList") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
    if (this.elem.value) {
      this.elem.value = JSON.parse(this.elem.value);
    }
  }
};
</script>

<style>
div {
    white-space: none;
}
</style>