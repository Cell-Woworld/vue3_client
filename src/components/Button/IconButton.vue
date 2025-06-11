<template>
  <v-btn
    :icon="(elem.iconized && elem.iconized !== 'false' && elem.iconized !== '0')"
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
    <v-col cols="12">
      <v-row :style="'place-content:center;margin-top:calc(-' + elem.height + '/ 2);'" width="100%">
        <v-badge v-if="elem.badge && !elem.badge.invisible && elem.badge.content" 
          :color="elem.badge.color" 
          :content="elem.badge.content" 
          :style="elem.badge.style"
          :class="elem.badge.class"
          :bordered="elem.badge.bordered"
          :overlap="elem.badge.overlap"
        >
        </v-badge>
        <v-icon 
          :color="elem.color2" 
          :size="elem.size" 
          :style="'padding:calc(' + css2json(elem.style).length==0?'0px':JSON.parse(css2json(elem.style))['padding'] + ';font-size:calc(' + elem.size + ' * 0.67);'"
        >{{elem.icon}}</v-icon>
      </v-row>
      <v-row style="place-content:center;" width="100%">
        <span :style="'position:absolute;margin-top:calc(' + elem.height + ' / 2 + 0.3em);color:' + css2json(elem.style).length==0?'black':JSON.parse(css2json(elem.style))['color'] + ';'">
          {{elem.label}}
        </span>
      </v-row>
    </v-col>
  </v-btn>
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
      /* We don't need this because its container will do it in Vue3 whether click.stop or not. It's strange.
      let _ui_event = {
        id: this.elem.id
    	};
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
      */
    },
    css2json: function(str){
      return '{'+ str
        .replace(/(\w*:)/g, '$1"')  //create json format
        .replace(/[;]/g, '";')
        .replace(/('{2,})/g, '"')
        .replace(/;/g, ',')
        .replace(/(['"])?([a-zA-Z0-9_-]+)(['"])?:/g, '"$2": ')
        .replace(/,\s*\}/,'}')
        .trim().slice(0,-1) + '}';
    },
  }
};
</script>
