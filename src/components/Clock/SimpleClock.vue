<template>
  <div>{{value}}</div>
</template>

<script>
export default {
  props: {
    elem: Object
  },
  data: () => ({
    value: 0,
    offset: 0
  }),
  mounted() {
    if (isNaN(this.elem.value)) {
      var _server_time = new Date(this.elem.value);
      this.offset= Date.now() - _server_time.getTime();
    } else {
      this.offset = 0;
    }
    this.clock();
  },
  methods: {
    clock: function() {
      var date = new Date(Date.now() - this.offset);
      this.value = date.toLocaleString();
      // var hour = date.getHours(),
      //   minute = checkTime(date.getMinutes()),
      //   ss = checkTime(date.getSeconds());

      // function checkTime(i) {
      //   if (i < 10) {
      //     i = "0" + i;
      //   }
      //   return i;
      // }

      // if (hour > 12) {
      //   hour = hour - 12;
      //   if (hour == 12) {
      //     hour = checkTime(hour);
      //     this.value = year + " " + hour + ":" + minute + ":" + ss + " AM";
      //   } else {
      //     hour = checkTime(hour);
      //     this.value = year + " " + hour + ":" + minute + ":" + ss + " PM";
      //   }
      // } else {
      //   this.value = year + " " + hour + ":" + minute + ":" + ss + " AM";
      // }
      setTimeout(this.clock, 1000);
    }
  }
};
</script>