<template>	
    <div
        v-on:click="handleClick"
        v-on:change="handleChanged"
        :style="elem.style"
    >
        <DynamicMarquee
            :direction = "elem.marquee.direction"
            :pause = "isPaused"
            :repeat = "!elem.marquee.noRepeat"
            :hoverPause = "!elem.marquee.noHoverPause"
            :repeatMargin = "elem.marquee.repeatMargin"
            :speed = "JSON.parse(elem.marquee.speed)"
            :reverse = "elem.marquee.reverse"
        >
        <div v-for="item in elem.items"
            :key="item.id"
            :style="item.style" 
        >
          <img 
            :src="item.src" 
            :alt="item.alt" 
            :style="{'width':item.width, 'height':item.height}"
            v-if="item.src"
          />
          <i v-if="item.icon" 
            :class="'mdi ' + item.icon"
            :style="'color:' + item.color"
          ></i>
          <span
            :style="'color:' + item.color2 + ';vertical-align:super;'"
          >
            {{item.content}}
          </span>
          <v-divider class="divider"/>
        </div>
        </DynamicMarquee>
    </div>
</template>


<script>
import DynamicMarquee from 'vue-dynamic-marquee';
export default {
  name: "Marquee",
  components: {
    DynamicMarquee,
  },
  props: {
    elem: Object
  },
  data: () => {
    return {
        isPaused: false,
    };
  },
  mounted() {
    this.isPaused = this.elem.marquee.pause;
  },
  methods: {
    handleClick: function() {
      this.$emit("click", event);
    },
    handleChanged: function() {
      this.$emit("change", event);
    }
  },
  computed: {
    computedSpeed() {
      return JSON.parse(this.elem.userData);
    }
  },
};
</script>

<style scoped>
.divider{
  border-width: thin;
  border-style: dashed !important;
}
</style>