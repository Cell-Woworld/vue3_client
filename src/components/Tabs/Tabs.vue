<template>
  <v-card v-if="elem.customizedHover">
    <v-tabs v-model="tab" :vertical="elem.vertical" :style="elem.style" :color="elem.color" background-color="transparent" grow>
      <v-tab v-for="(item,i) in computedItems" :key="i" :ref="item.id" v-on:click="handleClick(item)" style="width:20vw;padding:0px;">
          {{ item.label }}
          <v-icon>{{ item.icon }}</v-icon>
          <v-hover>
            <v-img slot-scope="{ hover }" v-if="hover" :src="item.src2">
            </v-img>
            <v-img v-else :src="item.src">
            </v-img>
          </v-hover>
      </v-tab>
    </v-tabs>
    <v-window v-model="tab" :touchless="true" style="background-color:transparent;">
      <v-window-item v-for="(item,i) in computedItems" :key="i" >
        <TabCard :elem="item" :style="item.style">
        </TabCard>
      </v-window-item>
    </v-window>
  </v-card>
  <v-card v-else>
    <v-tabs v-model="tab" :vertical="elem.vertical" :style="elem.style" :color="elem.color" background-color="transparent" grow>
      <v-tab v-for="(item,i) in computedItems" :key="i" :ref="item.id" v-on:click="handleClick(item)">
          {{ item.label }}
          <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
          <v-img v-if="item.src" :src="item.src"/>
      </v-tab>
    </v-tabs>
    <v-window v-model="tab" :touchless="true" style="background-color:transparent;">
      <v-window-item v-for="(item,i) in computedItems" :key="i" >
        <TabCard :elem="item" :style="item.style">
        </TabCard>
      </v-window-item>
    </v-window>
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
  }
};

import TabCard from "@/components/Card/TabCard.vue";
export default {
  name: "Tabs",
  components: {
    TabCard
  },
  props: {
    elem: Object
  },
  data() {
    return {
      tabIndex: null,
      items: []
    };
  },
  computed: {
    computedItems: function() {
      let _ret = [];
      this.elem.items.forEach(element => {
        if (!element.invisible) {
          _ret.push(element);
        }
      });
      return _ret;
    },
    tab : {
      set (tab) {
        this.tabIndex = tab;
        this.elem.value = tab;
      },
      get () {
        return parseInt(this.elem.value==''?this.tabIndex:this.elem.value);
      }
    }
  },
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "Tabs") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
  }
};
</script>