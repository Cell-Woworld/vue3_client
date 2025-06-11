<template>
  <div>
    <v-menu
      v-model="showMenu"
      offset-overflow
      location="top"
      close-on-click
      close-on-content-click
    >
      <template v-slot:activator="{ props }">
        <v-btn
          :icon="(elem.iconized && elem.iconized !== 'false' && elem.iconized !== '0')"
          :class="elem.class"
          :id="elem.id"
          :ref="elem.id"
          :width="elem.width"
          :height="elem.height"
          :color="elem.color"
          :alt="elem.alt"
          :disabled="elem.disabled"
          text
          v-bind="props"
          @click.left.prevent="showMenu = false; handleClick(elem)"
          @contextmenu.prevent="handleContextMenu(elem)"
          :value="elem.value"
        >
        <v-col cols="12">
            <v-row style="place-content:center;margin-bottom:0px;" width="100%">
              <img 
                :src="elem.src" 
                :alt="elem.alt" 
                :style="{'width':elem.width, 'height':elem.height}"
                v-if="elem.src && !value"
              />
              <img 
                :src="elem.src2" 
                :alt="elem.alt"
                :style="{'width':elem.width, 'height':elem.height}"
                v-if="elem.src2 && value"
              />
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
                :style="'margin-top:calc((' + elem.height +' - ' + elem.size +') / 2);font-size:calc(' + elem.size + ' * 0.8)'"
              >{{elem.icon}}</v-icon>
            </v-row>
            <v-row style="place-content:center;" width="100%">
              <span :style="'position:absolute;margin-top:0.3em;color:' + (css2json(elem.style).length==0?'black':JSON.parse(css2json(elem.style))['color']) + ';font-size:' + JSON.parse(css2json(elem.style))['font-size'] + ';'">
                {{elem.label}}
              </span>
            </v-row>
          </v-col>
        </v-btn>
      </template>

      <v-list
        style="background-color:#f8f8f8;color:black;"
        v-if="elem.items.length>0"
      >
        <v-list-item
          v-for="(item, index) in elem.items"
          :key="index"
          @click.stop="handleClick(item)"
        >
          <v-list-item-title :style="item.style">{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>


<script>
export default {
  name: "MenuToggleButton",
  props: {
    elem: Object
  },
  data: () => ({
    showMenu: false,
    value: false,
  }),
  methods: {
    handleClick: function(item) {
      // this.$emit('click', item);
		  let _ui_event = {
        id: item.id
    	};
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
    },
    handleContextMenu: function(item) {
      if (this.elem.items.length > 0) {
        this.showMenu = !this.showMenu;
        this.$emit('contextmenu', item);
      }
      else {
        this.$emit('click', item);
      }
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
  },
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "MenuToggleButton") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
    this.elem.value = (this.elem.value==true || this.elem.value=='true');
    this.value = this.elem.value;
  }
};
</script>

<style scoped>
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled)
{
  color: #4f4f4f !important;
}
</style>