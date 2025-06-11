<template>
  <div style="margin:0px;width:100%;height:100%;">
    <div
      class="content"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      :style="deleteSlider + ';background-color:' + getComputedStyle('background-color') + ';width:100%;height:100%;color:' + getComputedStyle('color') + ';'"
    >
      <!-- 插槽中放具体项目中需要内容 -->
      <slot name="img"></slot>
      <slot name="title"></slot>
      <slot name="price"></slot>
      <!-- 默认插槽 -->
      <slot></slot>
    </div>
    <div class="remove" ref="remove" @click="handleClick">
      <div style="height:100%;transform:translate(0px,calc(50% - 0.5em));">删除</div>
    </div>
  </div>
</template>

<script>
import { toJSON } from 'cssjson';
export default {
  name: "deleteTemplate",
  props: {
    elem: Object,
  },
  data() {
    return {
      startX: 0, //触摸位置
      endX: 0, //结束位置
      moveX: 0, //滑动时的位置
      disX: 0, //移动距离
      deleteSlider: "", //滑动时的效果,使用v-bind:style="deleteSlider"
      sensitivity: 1,
    };
  },
  methods: {
    touchStart(ev) {
      ev = ev || event;
      //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
      if (ev.touches.length == 1) {
        // 记录开始位置
        this.startX = ev.touches[0].clientX;
      }
    },
    touchMove(ev) {
      ev = ev || event;
      //获取删除按钮的宽度，此宽度为滑块左滑的最大距离
      let wd = this.$refs.remove.offsetWidth;
      if (ev.touches.length == 1) {
        // 滑动时距离浏览器左侧实时距离
        this.moveX = ev.touches[0].clientX;
        //起始位置减去 实时的滑动的距离，得到手指实时偏移距离
        this.disX = this.startX - this.moveX;
        //console.log(this.disX)
        // 如果是向右滑动或者不滑动，不改变滑块的位置
        if (this.disX < 0 || this.disX == 0) {
          this.deleteSlider = "transform:translateX(0px)";
        } else if (this.disX > 0) {
          // 大于0，表示左滑了，此时滑块开始滑动
          //具体滑动距离我取的是 手指偏移距离*this.sensitivity。
          this.deleteSlider = "transform:translateX(-" + this.disX * this.sensitivity + "px)";
          // 最大也只能等于删除按钮宽度
          if (this.disX * this.sensitivity >= wd) {
            this.deleteSlider = "transform:translateX(-" + wd + "px)";
          }
        }
      }
    },
    touchEnd(ev) {
      ev = ev || event;
      let wd = this.$refs.remove.offsetWidth;
      if (ev.changedTouches.length == 1) {
        let endX = ev.changedTouches[0].clientX;
        this.disX = this.startX - endX;
        //console.log(this.disX)
        //如果距离小于删除按钮一半,强行回到起点
        if (this.disX * this.sensitivity < wd / 2) {
          this.deleteSlider = "transform:translateX(0px)";
        } else {
          //大于一半 滑动到最大值
          this.deleteSlider = "transform:translateX(-" + wd + "px)";
        }
      }
    },
    handleClick: function () {
      this.deleteSlider = "transform:translateX(0px)";
      if (window.WsClient.proto_root_ === undefined) {
        window.console.log("protobuf is not ready");
        return;
      }

      let _ui_event = {
        id: this.elem.subcomponent,
        content: this.elem.id,
      };
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
    },
  },
  computed: {
    getComputedStyle() {
      const _converted = toJSON(this.elem.style);
      return attr=>_converted.attributes[`${attr}`];
    },
  }
};
</script>
<style scoped>
.slider {
  width: 100%;
  height: 120px;
  margin-bottom: 10px;
  position: relative;
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  transition: 0.3s;
  background-color: white;
}
.remove {
  position: absolute;
  width: 3em;
  height: 100%;
  background-color: gray;
  right: 0;
  top: 0;
  color: white;
  text-align: center;
  font-size: x-large;
  line-height: 100%;
}
</style>
