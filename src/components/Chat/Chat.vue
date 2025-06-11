<template>
  <v-container fluid id="chat-area" class="chat-container">
    <component :is="item.component" v-for="item in elem.items"
      v-show="!item.invisible || item.invisible=='false' || item.invisible == '0'"
      :elem="item"
      :id="item.id"
      :ref="item.id"
      :key="item.id"
      :class="item.class"
      :style="item.style"
      :color="item.color"
      :backgroundColor="item.backgroundColor"
      :height="item.height"
      :width="item.width"
      :float="item.float"
      :src="item.src"
      :alt="item.alt"
      :contain="item.contain"
      :label="item.label"
      :type="item.type"
      :max="item.max"
      :min="item.min"
      :step="item.step"
      :name="item.name"
      :readonly="item.readonly && item.readonly!='false' && item.readonly!='0'"
      :disabled="item.disabled && item.disabled!='false' && item.disabled!='0'"
      :inset="item.inset && item.inset!='false' && item.inset!='0'"
      :items="item.items"
      :accept="item.accept"
      :multiple="item.multiple"
      :fab="item.fab"
      :icon="item.iconized?item.iconized:item.icon?item.icon:null"
      :dark="item.dark"
      :dense="item.dense"
      :length="item.length"
      :halfIncrements="item.rating && item.rating.halfIncrements && item.rating.halfIncrements != 'false' && item.rating.halfIncrements != '0'"
      :emptyIcon="!item.rating||!item.rating.emptyIcon?'$ratingEmpty':item.rating.emptyIcon"
      :halfIcon="!item.rating||!item.rating.halfIcon?'$ratingHalf':item.rating.halfIcon"
      :fullIcon="!item.rating||!item.rating.fullIcon?'$ratingFull':item.rating.fullIcon"
      :prepend-icon="item.prependIcon"
      :prepend-inner-icon="item.prependInnerIcon"
      :prepend-outer-icon="item.prependOuterIcon"
      :center="item.map?item.map.center:undefined"
      :zoom="item.map?item.map.zoom:undefined"
      :locations="item.map?item.map.locations:undefined"
      v-on:click.once="elem.clickOnce?handleClick(item):null"
      v-on:click="!elem.clickOnce?handleClick(item):null"
      v-on:change="handleChanged([item,$event])"
      v-on:update:model-value="item.component=='v-select'||item.component=='v-autocomplete'||item.component=='v-combobox'?handleChanged([item,$event]):null"
      v-on:input="handleInput(item)"
      v-model="item.value"
      :modelValue="item.value"
      :value="item.component=='v-checkbox' || item.component=='v-switch'?true:item.value"
      hide-details
      :item-props="itemProps"
      :item-value="item.value"
      >{{item.content}}
    </component>
  </v-container>
</template>

<script>
import Section from "@/components/Section/Section.vue";

export default {
  props: {  
    elem: Object
  },
  components: {
    Section,
  },
  mounted() {
    this.scrollToBottom();
  },
  methods: {
    triggerSend(delay = 0) {
      setTimeout(() => {
        // logger.debug(`Triggering send to Teneo`);
        this.mustSend = true;
      }, delay);
    },
    debounceScroll() {
      if (this.isScrolling) {
        return;
      }
      // logger.debug("Scroll to bottom");
      this.isScrolling = true;
      let scrollToElement = document.getElementById("chat-scroll");
      const options = {
        duration: 1200,
        offset: -50,
        easing: "easeInQuad",
        container: "#chat-scroll"
      };
      try {
        if (scrollToElement) {
          this.$vuetify.goTo(9999, options);
        } else {
          this.isScrolling = false;
        }
      } catch {
        this.isScrolling = false;
      }
      setTimeout(() => {
        this.isScrolling = false;
      }, 1250);
    },
    debounce: function(func, wait, immediate) {
      let timeout;
      const context = this;
      return function debounceLogic(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(function callFunction() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
      }
    },
    scrollToBottom() {
      this.debounce(this.debounceScroll(), 2000, false);
      //this.debounceScroll();
    },
    itemProps: function(item) {
      return {
        title: item.text,
        value: item.value,
      }
    },
  }
};
</script>
<style scoped>
.chat-container {
  overflow-x: hide !important;
  width: 360px;
}

.chat-container-inner {
  overflow-x: hide !important;
  -webkit-box-shadow: 0 2px 20px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 20px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
.chat-bubble {
  --r: 20px; /* the radius */
  --t: 15px; /* the size of the tail */
  
  max-width: 300px;
  /* padding: calc(2*var(--r)/3); */
  -webkit-mask: 
    radial-gradient(var(--t) at var(--_d) 0,#0000 98%,#000 102%) 
      var(--_d) 100%/calc(100% - var(--r)) var(--t) no-repeat,
    conic-gradient(at var(--r) var(--r),#000 75%,#0000 0) 
      calc(var(--r)/-2) calc(var(--r)/-2) padding-box, 
    radial-gradient(at 50% 50%,#000 98%,#0000 101%) 
      0 0/var(--r) var(--r) space padding-box;
}

.chat-left {
  --_d: 0%;
  border-left: var(--t) solid #0000;
  margin-right: var(--t);
  place-self: start;
  float: left;
}

.chat-right {
  --_d: 100%;
  border-right: var(--t) solid #0000;
  margin-left: var(--t);
  place-self: end;
  float: right;
}
</style>
