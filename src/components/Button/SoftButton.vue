<template>
  <v-btn
    :icon="(elem.iconized && elem.iconized !== 'false' && elem.iconized !== '0')"
    :class="elem.class"
    :id="elem.id"
    :ref="elem.id"
    :style="elem.style"
    :width="elem.width"
    :height="elem.height"
    :color="elem.color"
    :alt="elem.alt"
    :disabled="elem.disabled"
    :data-ico="elem.icon"
    v-on:click.stop="handleClick()"
  >
    {{elem.content}}
  </v-btn>
</template>


<script>
export default {
  name: "SoftButton",
  props: {
    elem: Object
  },
  data: () => ({
  }),
  methods: {
    handleClick: function() {
    //   this.$emit('click');
		  let _ui_event = {
        id: this.elem.id
    	};
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
    }
  },
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "SoftButton") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
    if (this.$root.userData) {
      this.handleUserData(this.$root.userData);
    }
  }
};
</script>

<style lang="scss" scoped >
$d: 2em;
$t: .3s;
$c: #fcfcfc #d2dae6;

$o: .125*$d;

.soft-button {
	--i: var(--light, 0);
	--not-i: calc(1 - var(--i));
	--j: var(--press, 0);
	--not-j: calc(1 - var(--j));
	z-index: var(--i);
	border: none;
	width: $d; height: $d;
	border-radius: 15%;
	transform: scale(calc(1 - var(--j)*.02));
	box-shadow:  
		calc(var(--not-j)*#{-$o}) calc(var(--not-j)*#{-$o}) #{$o} #{rgba(nth($c, 1), var(--not-j))}, 
		calc(var(--not-j)*#{$o}) calc(var(--not-j)*#{$o}) #{$o} #{rgba(nth($c, 2), var(--not-j))}, 
		inset calc(var(--j)*#{$o}) calc(var(--j)*#{$o}) #{$o} #{rgba(nth($c, 2), var(--j))}, 
		inset calc(var(--j)*#{-$o}) calc(var(--j)*#{-$o}) #{$o} #{rgba(nth($c, 1), var(--j))};
	background: #e8e8e8;
	font-size: 2.5em;
	transition: box-shadow $t, transform $t cubic-bezier(.2,4,1,3);
	cursor: pointer;
	
	&::after {
		filter: 
			Contrast(0) 
			Sepia(var(--i)) 
			Hue-Rotate(calc(var(--hue) - 50deg))
			Saturate(5)
			Opacity(calc(var(--i) + .21*var(--not-i)))
			Drop-Shadow(1px 1px hsla(0, 0%, 100%, var(--not-i)));
		transition: filter $t;
		content: attr(data-ico)
	}
	
	&:focus { outline: none }
	&:hover, &:focus { --light: 1 }
	&:active { --press: 1 }
}
</style>