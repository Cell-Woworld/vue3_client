<template>
  <!-- <v-sheet class="mx-auto" elevation="8"> -->
  <v-sheet elevation="8">
    <v-slide-group v-model="elem.value" class="pa-4" v-if="elem.items.length>0" :show-arrows="elem.visible">
      <v-slide-item v-for="(item, i) in elem.items" :key="i">
        <CarouselCard :elem="item" :width="elem.width" :height="elem.height"/>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
import CarouselCard from "../Card/CarouselCard.vue";
export default {
  components: { CarouselCard },
  props: {
    elem: Object
  },

  data: () => ({
  })
};
</script>