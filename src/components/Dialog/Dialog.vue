<template>
  <v-row>
    <v-dialog v-model="dialog" persistent :max-width="elem.maxWidth?elem.maxWidth:'600px'" :content-class="elem.class">
      <DialogCard :elem="elem" :style="elem.style" />
    </v-dialog>
  </v-row>
</template>

<script>
import DialogCard from "@/components/Card/DialogCard.vue";
export default {
  name: "Dialog",
  components: {
    DialogCard
  },
  props: {
    elem: Object
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    handleClick: function(item) {
      window.console.log(item.id + " clicked");

      var _ui_event = {
        id: item.id
      };
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
    },
    syncVisibility: function(value) {
      this.dialog = value;
    }
  },
  watch: {
    isVisible: function() {}
  },
  computed: {
    isVisible() {
      this.syncVisibility(!this.elem.invisible || this.elem.invisible=='false');
      return !this.elem.invisible || this.elem.invisible=='false';
    }
  },
};
</script>