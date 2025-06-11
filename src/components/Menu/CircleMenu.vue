<template>
  <div class="circle-menu">
    <button
      class="menu-btn"
      @click="isToggle"
      :class="[isShow ? 'open' : 'close']"
      style="background-color:#00000080"
    >
      <i></i> <i></i> <i></i> <span class="ripple"></span>
    </button>

    <transition name="move" mode="out-in" appear>
      <ul class="menu" v-show="isShow">
        <li
          v-for="(item, index) in elem.items"
          :key="index"
          :style="item.style"
          class="menuitem-wrapper"
        >
          <div class="icon-holder">
            <a href="#" 
              class="menu-item" 
              style="text-decoration:none;line-height:0.5rem;margin:0px;"
              v-on:click="handleClick(item)"
            >
              <i :class="'mdi '+item.icon" ></i>
              <span style="font-size:small;">{{ item.text }}</span>
            </a>
          </div>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
var defaultMethods = {
  handleClick: function (item) {
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }

    var _ui_event;
    switch (item.id) {
      default:
        _ui_event = {
          id: item.id,
        };
        window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
        break;
    }
  },
  isToggle() {
    this.isShow = !this.isShow;
  }
};
export default {
  name: "CircleMenu",
  props: {
    elem: Object
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: defaultMethods,
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$spin-speed: 0.7s;
$color-collection: ("#2980b9", "#8e44ad", "#e88fac", "#f39c12", "#c0392b");
$degFactor: 71.5;

.circle-menu {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 20rem;
  height: 20rem;
  margin-top: -10rem;
  margin-left: -10rem;
}

.menu {
  width: 100%;
  height: 100%;
  // transform: scale(0);
  transform-origin: center;
  // transition: all 0.08s ease-in-out;

  &.move-enter-active,
  &.move-leave-active {
    transition: all 0.08s ease-in-out;
  }

  &.move-enter,
  &.move-leave-to {
    transform: scale(0);
  }

  li {
    position: absolute;
    top: 50%;
    left: 50%;
    display: inline-block;
    width: 4rem;
    height: 80%;
    margin-top: -8rem;
    margin-left: -2rem;
    text-align: center;

    &.spin {
      z-index: 5;
      .icon-holder {
        animation: spin $spin-speed linear forwards;
      }
      .circle-holder {
        display: block;
        circle {
          animation: dash $spin-speed linear forwards;
        }
      }
    }
  }

  a {
    position: relative;
    display: inline-block;
    width: 4rem;
    height: 4rem;
    margin-top: 4.5rem;
    padding: 1rem;
    border-radius: 100%;
    transform: scale(1, 1);
    color: white;

    i {
      display: inline-block;
      vertical-align: middle;
      line-height: 1.2;
    }
  }
}

.icon-holder {
  position: relative;
  z-index: 1;
  display: inline-block;
  width: 4rem;
  height: 100%;
}

.menu-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  display: block;
  width: 4rem;
  height: 4rem;
  margin: -2rem;
  padding: 1.3rem;
  background: white;
  border: none;
  box-shadow: none;
  border-radius: 100%;
  text-align: center;
  line-height: 1;
  appearance: none;
  outline: none;
  cursor: pointer;
  font-size: 0;

  i {
    position: relative;
    z-index: 11;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    height: 0.1rem;
    margin: 0 auto;
    background: #2c3e50;
  }
  i:nth-child(2) {
    margin: 0.34rem auto;
  }
}
.ripple {
  position: absolute;
  top: -1rem;
  left: -1rem;
  z-index: 10;
  display: block;
  width: 6rem;
  height: 6rem;
  transform: scale(0.5);
  opacity: 0;
  border: 2rem solid white;
  border-radius: 100%;
}

@for $i from 0 to length($color-collection) {
  .menu li:nth-child(#{$i + 1}) {
    transform: rotate(#{($i - 1) * $degFactor}deg);
      z-index: 2;
      background-color:transparent;

    a {
      transform: rotate(#{-($i - 1) * $degFactor}deg);
      background: unquote(nth($color-collection, $i + 1));
    }
    circle {
      stroke: unquote(nth($color-collection, $i + 1));
      top:0px;
    }
  }

  .bg-#{$i} {
    background: unquote(nth($color-collection, $i + 1));
  }

  .move-enter-active {
    li {
      transition-timing-function: cubic-bezier(0, 0.57, 0.44, 1.97);

      &:nth-child(#{$i + 1}) {
        transition-delay: ($i + 1) * 0.2s;
      }
    }
  }

  .move-enter,
  .move-leave-active {
    li {
      transition-timing-function: ease-in-out;

      &:nth-last-child(#{$i + 1}) {
        transition-delay: ($i + 1) * 0.2s;
      }
    }
  }
}

.open.menu-btn {
  animation: buttonactive ease-in 0.2s forwards 1;

  i:first-child {
    animation: top-down ease-in 0.2s forwards 1;
  }
  i:nth-child(2) {
    animation: middle ease-in 0.01s forwards 1;
  }
  i:nth-child(3) {
    animation: down-top ease-in 0.2s forwards 1;
  }

  .ripple {
    animation: ripples ease-in 0.35s forwards 1;
  }
}

@keyframes buttonactive {
  0% {
    background: white;
    transform: rotate(0deg);
  }
  100% {
    background: lighten(#34495e, 15%);
    transform: rotate(-90deg);
  }
}
@keyframes middle {
  0% {
    opacity: 1;
    left: 0;
  }
  100% {
    opacity: 0;
    left: -4rem;
  }
}

@keyframes top-down {
  0% {
    top: 0;
    transform: rotate(0);
  }
  100% {
    top: 0.35rem;
    transform: rotate(-45deg);
  }
}

@keyframes down-top {
  0% {
    top: 0;
    transform: rotate(0);
  }
  100% {
    top: -0.4rem;
    transform: rotate(45deg);
  }
}

@keyframes ripples {
  0% {
    opacity: 1;
    transform: scale(0.5);
    border-width: 3rem;
  }
  100% {
    opacity: 0.5;
    transform: scale(1);
    border-width: 0rem;
  }
}
</style>
