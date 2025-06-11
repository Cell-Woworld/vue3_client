<template>
  <v-textarea
    v-on:click="handleClick"
    v-on:change="handleChanged"
    v-model="value"
  >
  </v-textarea>
</template>


<script>
export default {
  props: {
    elem: Object
  },
  data: () => ({
    value: ""
  }),
  mounted() {
    this.value = this.elem.value;
  },
  methods: {
    handleClick: function() {
      this.$emit("click", event);
    },
    handleChanged: function() {
      this.$emit("change", event);
    }
  }
};
</script>
