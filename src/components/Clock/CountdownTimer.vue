<template>
  <div
    :value="computedValue"
  >{{value}}</div>
</template>

<script>
export default {
  props: {
    elem: Object
  },
  data: () => ({
    maxValue: 0,
    value: 0,
    offset: 0,
  }),
  mounted() {
    if (!isNaN(this.elem.value)) {
      this.maxValue = this.elem.max;
      this.offset = this.elem.max - this.elem.value;
    } else {
      // this.value = 0;
      // this.offset = 0;
    }
    this.clock();
  },
  computed: {
    computedValue() {
      if (!isNaN(this.elem.value)) {
        return this.elem.value;
      } else {
        return this.value;
      }
    }
  },
  methods: {
    clock: function() {
      if (this.offset >= this.maxValue)
        this.offset = 0;
      this.offset++;
      this.value = this.maxValue - this.offset;
      setTimeout(this.clock, 1000);
    }
  }
};
</script>