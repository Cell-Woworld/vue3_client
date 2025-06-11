<template>
  <a :href="elem.href" target="_blank">
    <v-img 
      :src="elem.src" 
      :alt="elem.alt" 
      :contain="elem.contain"
      :width="elem.width"
      :height="elem.height"
      :maxWidth="elem.maxWidth"
      :minWidth="elem.minWidth"
      :maxHeight="elem.maxHeight"
      :minHeight="elem.minHeight"
      :style="elem.style"
    />
  </a>
</template>

<script>
export default {
  name: "hRefImg",
  props: {
    elem: Object
  },
  data: () => ({}),
  mounted() {},
  methods: {}
};
</script>