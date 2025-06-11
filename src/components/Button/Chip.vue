<template>
  <v-chip
    :class="elem.class"
    :id="elem.id"
    :ref="elem.id"
    :style="elem.style"
    :width="elem.width"
    :height="elem.height"
    :color="elem.color"
    :alt="elem.alt"
    :disabled="elem.disabled"
    v-on:click.stop="handleClick()"
  >
    <v-icon 
      :color="elem.color2" 
      :size="elem.size" 
      style="top:0px;"
    >{{elem.icon}}</v-icon>
    {{elem.content}}
  </v-chip>
</template>


<script>
export default {
  props: {
    elem: Object
  },
  data: () => ({
  }),
  methods: {
    handleClick: function() {
      // this.$emit('click');
		  let _ui_event = {
        id: this.elem.id
    	};
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
    }
  }
};
</script>
