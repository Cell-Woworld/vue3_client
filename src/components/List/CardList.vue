<template>
  <v-container>
    <v-row style="text-align:left;margin:0% 1%;" v-if="elem.cols !== undefined && elem.cols > 0" >
      <v-col v-for="(item, i) in elem.items" :key="i" :cols="elem.cols">
        <ListCard :elem="item" :style="item.style"></ListCard>
      </v-col>
    </v-row>
    <v-row style="text-align:left;margin:0% 1%;" v-else >
      <v-col v-for="(item, i) in elem.items" :key="i" :cols="item.cols" xs="12" sm="6" md="4" lg="3">
        <ListCard :elem="item" :style="item.style"></ListCard>
      </v-col>
    </v-row>
  </v-container>
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

import ListCard from "@/components/Card/ListCard.vue";
export default {
  props: {
    elem: Object
  },
  components: { ListCard },
  data: () => ({
  }),
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "CardList") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
  }
}
</script>