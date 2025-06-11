<template>
  <v-footer :style="elem.style">
    <v-col class="text-center" cols="12">
      {{ new Date().getFullYear() }} —
      <strong>{{elem.content}}</strong>
    </v-col>
  </v-footer>
</template>

<script>
export default {
  props: {
    elem: Object
  }
};
</script>