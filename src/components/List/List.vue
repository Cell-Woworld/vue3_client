<template>
  <v-list flat :style="elem.style?elem.style:'background-color: transparent;border-color: transparent;text-align:center;margin-top:30px;font-size:larger;'">
    {{elem.label}}
    <v-list-subheader v-if="elem.label"></v-list-subheader>
    <v-list-item 
      v-for="(item,i) in elem.items"
      :key="item.id"
      :disabled="item.disabled" 
      v-show="!item.invisible || item.invisible=='false'" 
      v-on:click="handleClick(item)"
    >
      <template v-slot:prepend>
          <v-icon v-if="item.icon" :icon="item.icon" :size="item.size" :color="item.color"></v-icon>
      </template>
      <v-list-item-title v-if="item.content" v-text="item.content" :class="item.class" :style="item.style"></v-list-item-title>
      <v-divider
        v-if="divided & i + 1 < elem.items.length"
        :key="i"
      ></v-divider>
    </v-list-item>
  </v-list>
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
          id: this.elem.id,
          content: item.id,
        };
        window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
        break;
    }
  }
};

//import Section from "@/components/Section/Section.vue";
export default {
  components: { },
  props: {
    elem: Object
  },
  data: () => ({
    selection: null,
    divided: false
  }),
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "List") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
  }
};
</script>