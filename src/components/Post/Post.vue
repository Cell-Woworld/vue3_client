<template>
  <div fluid id="post-area" 
    class="post-container" 
    style="background-color:transparent;"
  >
    <v-card 
      :color="elem.color" 
      :key="elem.id" 
      :flat="elem.flat"
      :elevation="elem.elevation"
      :style="'background-color:transparent;overflow:hidden auto;height:' + elem.height"
    >
      <div v-for="(item, i) in elem.items" :key="i">
        <component v-if="!item.invisible || item.invisible=='false'"
          :is="item.component"
          :elem="item"
          :id="item.id"
          :ref="item.id"
          :key="item.id"
          :class="item.class"
          :style="item.style"
          :color="item.color"
          :height="item.height"
          :width="item.width"
          :size="item.size"
          :float="item.float"
          :src="item.src"
          :contain="item.contain"
          :label="item.label"
          :type="item.type"
          :max="item.max"
          :min="item.min"
          :step="item.step"
          :name="item.name"
          :readonly="item.readonly"
          :items="item.items"
          v-on:click="handleClick(item)"
          v-on:change="handleChanged(item)"
          v-model="item.value"
        >{{translateContent(item)}}</component>
      </div>
    </v-card>

    <PostInput v-if="!elem.post || !elem.post.noInput"
      :toggleButton="showAudioInput"
      :passUserInput="userInput"
      :handleInputFocus="handleFocus"
      :sendParams="sendParams"
      :mustSend="mustSend"
      :key="postInputComponentKey"
      :class="{
          'light-scroll green lighten-4': true,
      }"
      @reset="resetpostInputDirections"
      @scroll="scrollToBottom"
    ></PostInput>
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
  handleChanged: function (item) {
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }
    // var _ui_event;
    switch (item.id) {
      default:
        break;
    }
  },
  translateContent: function(item) {
    const DATETIME_RULE = /^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T ](0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])($|Z$| [+-](0[0-9]|1[0-2])\d\d$)/;
    var _content = item.content;
    var _value = item.value;
    if (/^\w*([Dd]ate)(_?)([Tt]ime)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validTime = element.match(DATETIME_RULE);
        if (validTime) {
          _content += new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z').toLocaleString().slice(0,-3);
        }
        else {
          _content += element;
        }
      });
      if (item.value && item.value.includes('#') > 0) {
        _value = '';
        item.value.split('#').forEach(element => {
          let validTime = element.match(DATETIME_RULE);
          if (validTime) {
            _value += new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z').toLocaleString().slice(0,-3);
          }
          else {
            _value += element;
          }
        });
        item.value = _value;
      }
    }
    else if (/^\w*([Tt]ime)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validTime = element.match(DATETIME_RULE);
        if (validTime) {
          _content += new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z').toLocaleTimeString('en-GB').slice(0,-3);
        }
        else {
          _content += element;
        }
      });
      if (item.value && item.value.includes('#') > 0) {
        _value = '';
        item.value.split('#').forEach(element => {
          let validTime = element.match(DATETIME_RULE);
          if (validTime) {
            _value += new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z').toLocaleTimeString('en-GB').slice(0,-3);
          }
          else {
            _value += element;
          }
        });
        item.value = _value;
      }
    }
    else if (/^\w*([Dd]ate)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
      let validTime = element.match(DATETIME_RULE);
        if (validTime) {
          let _datetime = new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z');
          const [year, month, day] = [_datetime.getFullYear(), _datetime.getMonth() + 1, _datetime.getDate()];
          _content += `${year}/${month}/${day}`;
        }
        else {
          _content += element;
        }
      });
      if (item.value && item.value.includes('#') > 0) {
        _value = '';
        item.value.split('#').forEach(element => {
        let validTime = element.match(DATETIME_RULE);
          if (validTime) {
            let _datetime = new Date(element.substr(0,10) + 'T' + element.substr(11,8) + 'Z');
            const [year, month, day] = [_datetime.getFullYear(), _datetime.getMonth() + 1, _datetime.getDate()];
            _value += `${year}/${month}/${day}`;
          }
          else {
            _value += element;
          }
        });
        item.value = _value;
      }
    }
    else if (/^\w*([Nn]umber)(_?)([Dd]ouble)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validNumber = element.match(/^\d+\.?\d*$/);
        if (validNumber) {
          _content += (Math.round(parseFloat(element) * 100) / 100).toFixed(2);
        }
        else {
          _content += element;
        }
      });
      if (item.value && item.value.includes('#') > 0) {
        _value = '';
        item.value.split('#').forEach(element => {
          let validNumber = element.match(/^\d+\.?\d*$/);
          if (validNumber) {
            _value += Math.round(parseFloat(element) * 100) / 100;
          }
          else {
            _value += element;
          }
        });
        item.value = _value;
      }
    }
    else if (/^\w*([Dd]iscount|[Pp]ercent)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validNumber = element.match(/^\d+\.?\d*$/);
        if (validNumber) {
          _content += (Math.round(parseFloat(element) * 10000) / 100).toFixed(2) + '%';
        }
        else {
          _content += element;
        }
      });
    }
    else if (/^\w*([Nn]umber)(_?)([Ii]nteger)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validNumber = element.match(/^\d+\.?\d*$/);
        if (validNumber) {
          _content += Math.round(parseFloat(element));
        }
        else {
          _content += element;
        }
      });
    }
    else if (/^\w*([Pp]ad[Ii]nteger8)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        let validNumber = element.match(/^\d+\.?\d*$/);
        if (validNumber) {
          _content += Math.round(parseFloat(element)).toString().padStart(8,0);
        }
        else {
          _content += element;
        }
      });
    }
    else if (/^\w*(JSON|json)2([Ll]ist)\w*$/.test(item.id)) {
      _content = '';
      item.content.split('#').forEach(element => {
        try {
          let _listInJSON = JSON.parse(element);
          Object.entries(_listInJSON).forEach(([key, value]) => {
            if (value)
              _content += key + ' ';
          });
        }
        catch {
          _content += element;
        }
      });
    }
    return _content;
  },
  resetpostInputDirections: function() {
    this.handleFocus = false;
    this.userInput = "";
    this.mustSend = false;
    this.sendParams = "";
    this.showDate = false;
    this.showTime = false;
    this.date = "";
    this.postInputComponentKey += 1;
  },
  updateInputBox: function(userInput) {
    this.userInput = userInput;
  },
  triggerSend: function(delay = 0) {
    setTimeout(() => {
      this.mustSend = true;
    }, delay);
  },
  swapInputButton: function() {
    this.showAudioInput = !this.showAudioInput;
  },
  debounceScroll: function() {
    if (this.isScrolling) {
      return;
    }
    // logger.debug("Scroll to bottom");
    this.isScrolling = true;
    let scrollToElement = document.getElementById("post-scroll");
    const options = {
      duration: 1200,
      offset: -50,
      easing: "easeInQuad",
      container: "#post-scroll"
    };
    try {
      if (scrollToElement) {
        this.$vuetify.goTo(9999, options);
      } else {
        this.isScrolling = false;
      }
    } catch {
      this.isScrolling = false;
    }
    setTimeout(() => {
      this.isScrolling = false;
    }, 1250);
  },
  debounce: function(func, wait, immediate) {
    let timeout;
    const context = this;
    return function debounceLogic(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(function callFunction() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    }
  },
  scrollToBottom: function() {
    this.debounce(this.debounceScroll(), 2000, false);
    //this.debounceScroll();
  },
  onHtmlClick: function(event) {
    // Find the closest anchor to the target.
    const anchor = event.target.closest("a");
    if (!anchor) return;

    // Check to make sure this is from our v-html because
    // we don't want to handle clicks from other things in
    // the Vue
    if (!anchor.classList.contains("sendInput") && !anchor.classList.contains("openInIframe")) {
      return; // basically treat like a normal link
    } else if (anchor.classList.contains("openInIframe")) {
      // logger.debug(`Open Link in IFRAME`);
      // open in iframe
      event.stopPropagation();
      event.preventDefault();
      this.$store.commit("UPDATE_FRAME_URL", anchor.getAttribute("href"));
    } else {
      // send input
      event.stopPropagation();
      event.preventDefault();
      if (anchor.getAttribute("data-input")) {
        // logger.debug(`Update input box with data-input attribute of link`);
        this.userInput = anchor.getAttribute("data-input");
      } else {
        // logger.debug(`Update input box with text of link`);
        this.userInput = anchor.innerText;
      }
      this.sendParams = "&isClick=true";
      this.triggerSend(200);
    }
  }
}

import PostInput from "@/components/Post/PostInput.vue";
import ChatCard from "@/components/Card/ChatCard.vue";

export default {
  props: {  
    elem: Object
  },
  components: {
    PostInput,
    ChatCard,
  },

  data() {
    return {
      showAudioInput: false,
      userInput: "",
      handleFocus: false,
      sendParams: "",
      mustSend: false,
      showLeopardDialog: false,
      interval: {},
      mustScroll: true,
      oldDialogLength: 0,
      showDate: false,
      showTime: false,
      showFeedback: false,
      audioInFocus: false,
      date: "",
      isScrolling: false,
      postInputComponentKey: "55555", // so important for IE11 performance!!

      showpostLoading: false,
      showLivepostProcessing: false,
      progressBar: false,
    };
  },
  methods: defaultMethods,
  watch: {
    dialog: function(newDialog) {
      if (newDialog.length !== this.oldDialogLength) {
        this.mustScroll = true;
        this.oldDialogLength = newDialog.length;
      }
    },
  },
  computed: {
    dialog() {
        return this.getLatestDialogHistory ? this.getLatestDialogHistory : [];
    }
  },
  mounted() {
    this.scrollToBottom();
  },
};
</script>
<style scoped>
.loading-ball {
  width: 360px;
}

#post-scroll {
  scrollbar-width: thin;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  outline: 0;
}

#post-scroll:focus {
  outline: 0;
  box-shadow: inset 0 0 0 1px rgba(17, 18, 25, 0.2) !important;
}

.container {
  padding: 0 !important;
}

div.upload-btn {
  padding-right: 0 !important;
  padding-left: 0 !important;
}

label.upload-btn {
  padding-right: 0 !important;
  padding-left: 0 !important;
}

button.v-expansion-panel-header:active {
  border-style: none !important;
}

button.v-expansion-panel-header:focus {
  background: unset;
  -webkit-box-shadow: none !important;
  -moz-box-shadow: none !important;
  box-shadow: none !important;
}

div#post-area p {
  margin-bottom: 2px;
}

div.chat-footer {
  bottom: 50px;
  position: fixed;
  width: 100vw;
  max-height: 50vh;
  overflow-y: auto;
}

:deep().div.chat-footer .v-input__slot {
  margin-top: 8px !important;
  padding-right: 0px !important;
  background: transparent !important;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}

:deep().div.chat-footer .v-text-field__details {
  position: absolute;
  margin-top: 45px;
}

div.post-container .v-expansion-panel-header {
  cursor: unset !important;
  user-select: text !important;
}

v-expansion-panel-header div.post-container .v-expansion-panel:not(:first-child)::after {
  border-top: none !important;
}

.v-expansion-panel:not(:first-child)::after {
  border-top: none !important;
}

div.post-container .v-expansion-panel-header--mousedown {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}

div.post-container .v-expansion-panel::before {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}

.v-toolbar__title:not(:first-child) {
  margin-left: 12px !important;
}

.v-toolbar__title {
  font-size: 17px !important;
  white-space: unset !important;
}

@media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
  /* IE10+ specific styles go here */
  /* .post-card {
    font-size: 1.1em;
    font-weight: 400;
    padding: 8px;
    margin-top: 4px;
    width: 260px;
    line-height: 1.2em;
    display: table;
  } */
}

.post-card {
  display: table;
  width: fit-content;
  margin-top: 4px;
  padding: 8px !important;
  font-weight: 400;
  line-height: 1.4em;
}

.post-card-left {
  padding-bottom: 3px !important;
  -moz-border-radius: 3px 13px 13px 13px !important;
  -webkit-border-radius: 3px 13px 13px 13px !important;
  border-radius: 3px 13px 13px 13px !important;
}

.post-card-right {
  margin-left: auto !important;
  -moz-border-radius: 13px 3px 13px 13px !important;
  -webkit-border-radius: 13px 3px 13px 13px !important;
  border-radius: 13px 3px 13px 13px !important;
}

div.options-list a.v-list__tile--link {
  height: inherit !important;
  cursor: pointer;
}

.post-responses-float {
  overflow-x: hidden;
  overflow-y: auto;
  /* min-height: calc(100vh - 900px); */
}

.post-responses-float-mobile {
  height: calc(var(--vh, 1vh) * 80 - 0px) !important;
}

.post-responses {
  overflow-x: hidden;
  overflow-y: auto;
  /* height: calc(100vh - 10px); */
  /* min-height: calc(100vh - 10px); */
  /* max-height: calc(100vh - 10px); */
}

.post-container {
  overflow-x: hide !important;
  width: 100%;
}

.post-container-inner {
  overflow-x: hide !important;
  -webkit-box-shadow: 0 2px 20px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 20px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

/*
@media only screen and (max-height: 480px) {
  .post-responses,
  .post-responses-float {
    min-height: calc(100vh - 130px);
  }

  .post-responses-float-mobile {
    height: calc(var(--vh, 1vh) * 100 - 130px);
    min-height: calc(var(--vh, 1vh) * 100 - 130px);
  }
}
*/
@media only screen and (max-width: 480px) {
  .v-footer,
  .post-container,
  .loading-ball {
    width: 100vw !important;
  }
/*
  .post-responses,
  .post-responses-float {
    min-height: calc(100vh - 130px);
  }

  .post-responses-float-mobile {
    height: calc(var(--vh, 1vh) * 100 - 130px);
    min-height: calc(var(--vh, 1vh) * 100 - 130px);
  }
*/
}

.post-card-right-tail
{
  margin-left: auto !important;
  -moz-border-radius: 10px 10px 10px 10px !important;
  -webkit-border-radius: 10px 10px 10px 10px !important;
  border-radius: 10px 10px 10px 10px !important;
}

.post-card-right-tail:after {
    content: '';
    top: 6px;
    right: -25px;
    position: absolute;
    border: 0px solid;
    display: block;
    width: 25px;
    height: 10px;
    background-color: transparent;
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;
    box-shadow: -21px 9px 0px 8px rgba(165, 219, 255, 0.7);
}

.post-card-left-tail {
  padding-bottom: 3px !important;
  -moz-border-radius: 10px 10px 10px 10px !important;
  -webkit-border-radius: 10px 10px 10px 10px !important;
  border-radius: 10px 10px 10px 10px !important;
}

.post-card-left-tail:after {
  content: '';
  top: 6px;
  left: -25px;
  position: absolute;
  border: 0px solid;
  display: block;
  width: 25px;
  height: 10px;
  background-color: transparent;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  box-shadow: 21px 9px 0px 8px rgb(154, 205, 50, 0.7);
}
</style>
