<template>
  <div v-html="content"/>
</template>


<script>
export default {
  props: {
    elem: Object
  },
  data() {
    return {
      content: null
    }
  },
  methods: {
    translate_content: function() {
      switch (this.elem.id) {
        case "app_order_contract_content1": {
          this.content = '';
          this.elem.content.split('#').forEach(element => {
            var validTime = element.match(/^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[ T](0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])($| [+-](0[1-9]|1[0-2])\d\d$)/);
            if (validTime) {
              var _datetime = new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z');
              const [year, month, day] = [_datetime.getFullYear(), _datetime.getMonth() + 1, _datetime.getDate()];
              this.content += `${year}/${month}/${day}`;
            }
            else {
              this.content += element;
            }
          });
          break;
        }
        default:
          this.content = this.elem.content;
          break;
      }
      //return content;
    }
  },
  mounted() {
    this.translate_content();
  },
};
</script>
