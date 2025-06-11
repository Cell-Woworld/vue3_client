<template>
  <v-app :style="background">
    <div v-for="item in body" :key="item.id">
      <component v-if="item.component !=='Dialog' || !item.invisible || item.invisible=='false'" v-show="!item.invisible || item.invisible=='false'"
        :is="item.component"
        :elem="item"
        :id="item.id"
        :key="item.alt?item.alt:item.id"
        :ref="item.id"
        :class="item.class"
        :style="item.style"
        :color="item.color"
        :height="item.height"
        :width="item.width"
        :float="item.float"
        :src="item.src"
        :contain="item.contain"
        :label="item.label"
        :type="item.type"
        :max="item.max"
        :min="item.min"
        :step="item.step"
        :modelValue="item.value"
        :name="item.name"
        :readonly="item.readonly"
        :openOnClick="item.openOnClick"
        :items="item.items"
        :activatable="item.activatable"
        :returnObject="item.returnObject"
        v-on:click="handleClick(item)"
        @update:active="on_item_selected"
      >{{item.content}}</component>
    </div>
  </v-app>
</template>

<script>
import * as components from 'vuetify/components'
import Container from "@/components/Section/Container.vue";
import Footer from "@/components/Footer/Footer.vue";
import YesNo from "@/components/Question/YesNo.vue";
import OK from "@/components/Question/OK.vue";
import Dialog from "@/components/Dialog/Dialog.vue";
import BdDialog from "@/components/Dialog/BdDialog.vue";
import Tabs from "@/components/Tabs/Tabs.vue";
import Loading from "@/Loading.json";
import VeriCode from "@/components/VeriCode/VeriCode.vue";
import BottomNavigation from "@/components/Navigation/BottomNavigation.vue";
export default {
  name: "App",
  components: {
    ...components,
    Footer,
    YesNo,
    OK,
    Dialog,
    BdDialog,
    Tabs,
    VeriCode,
    BottomNavigation,
    Container,
  },

  data: () => ({
    //body: [],
    body: Loading.layout,
    background:
      Loading.background.style +
      (Loading.background.src?"background-image:url(" +
      "getImageUrl(Loading.background.src)" +
      ");":";"),
    userData: null,
    methodList: null,
    params: null,
  }),
  methods: {
    handleClick: function(item) {
      window.console.log(item.id + " clicked");

      var _ui_event = {
        active: item.id
      };
      // window.WsClient.PacketOut("Generic.Client.clicked", _ui_event);
      switch (item.id) {
        case "show_version":
          if (this.body[2].content !== "" && window.cordova) {
            var _self = this;
            window.cordova.getAppVersion.getAppName().then(function(appName) {
              // My App Name
              //console.log("App Name", appName);
              var _appName = appName;
              window.cordova.getAppVersion
                .getVersionNumber()
                .then(function(versionNumber) {
                  // 1.0.0
                  //window.console.log("version number", versionNumber);
                  var _dialog_content = JSON.parse(_self.body[2].content);
                  _dialog_content.question = _appName + " v." + versionNumber; //navigator.appVersion;
                  _self.body[2].content = JSON.stringify(_dialog_content);
                  _self.$refs.app_version_info[0].dialog = true;
                });
            });
          }
          break;
        default:
          break;
      }
    },
    on_item_selected: function(object) {
      if (object) {
        window.console.log("id:" + object[0].id + ", name:" + object[0].name);
      }
    },
    replaceKeyword: function(element) {
      if (element.src != undefined && element.src != "" && element.src.match(/^@\/.*$/)) {
        element.src = 'getImageUrl(' + element.src.substr(2) + ')';
      }
      if (element.src2 != undefined && element.src2 != "" && element.src2.match(/^@\/.*$/)) {
        element.src2 = 'getImageUrl(' + element.src2.substr(2) + ')';
      }
      switch (element.component)
      {
        case 'NavigationDrawer':
        case 'v-switch':
        case 'v-checkbox': {
          element.value = (element.value!=false && element.value !== "false" && element.value !== "0");
          break;
        }
        case 'CardCarousel':
        case 'v-rating': {
          element.value = parseFloat(element.value);
          break;
        }
        case 'v-text-field':
        case 'v-textarea':
          {
            if (typeof element.value === 'object') {
              element.value = JSON.stringify(element.value);
            }
            break;
          }
        default: {
          if (element.subcomponent === 'v-btn-toggle') {
            element.value = parseInt(element.value);
          }
          if (element.value && (element.value[0]==='{' && element.value[element.value.length - 1]==='}'
                ||element.value[0]==='[' && element.value[element.value.length - 1]===']')) {
            try {
              element.value = JSON.parse(element.value.replaceAll('\\"', '"'));
            }
            catch {
              window.console.log('parse error: ' + element.value);
            }
          }
          else if (element.content=='#appVersion#') {
            if (window.appVersion) {
              element.content = " V " + window.appVersion;
              element.invisible = false;
            } else {
              var _counter = 0;
              var _get_version_interval = setInterval(() => {
                _counter++;
                if (_counter > 250) {
                  window.clearInterval(_get_version_interval);
                } else if (window.appVersion) {
                  element.content = " V " + window.appVersion;
                  element.invisible = false;
                }
              }, 100);
            }
          }
          break;
        }
      }
      if (element.items != undefined) {
        element.items.forEach(element => {
          this.replaceKeyword(element);
        });
      }
    },
    findElement: function(targetList,element) {
      const UUID_RULE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
      let _target = null;
      targetList.every(child => {
        if (child.id == element.id) {
          _target = targetList;
          return false;
        } else if (child.id.match(UUID_RULE) && child.items) {
          _target = this.findElement(child.items,element);
          return (!_target);
        }
        return true;
      });
      return _target;
    },
    replaceElement: function(targetList,element) {
      if (element.id) {
        if (element.component) {
          targetList.forEach((element2,index) => {
            if (element2.id === element.id) {
              targetList[index] = element;
            }
          });
        } else if (element.items != undefined) {
          let _target = this.findElement(targetList,element);
          if (_target) {
            element.items.forEach(child => {
              this.replaceElement(_target.find(x => x.id === element.id).items, child);
            },this);
          }
        }
      }
    },
    eventHandler: function(name, object) {
      window.console.log(name);
      switch (name) {
        case "VuetifyKits.Layout":
          object.layout.forEach(element => {
            this.replaceKeyword(element);
          },this);
          this.body = object.layout;
          if (object.background !== undefined && object.background !== null) {
            this.background = object.background.style;
            if (
              object.background.src != undefined &&
              object.background.src != ""
            ) {
              this.background +=
                "background-image:url(" +
                'getImageUrl(' + object.background.src + ')' +
                ");";
            }
          } else {
            this.background = "";
          }
          if (object.userData !== undefined && object.userData !== "") {
            this.userData = JSON.parse(object.userData);
            Object.entries(this.userData).forEach(
              ([key, value]) => {
                switch (key) {
                  case 'eval':
                    setTimeout(() => {
                      window.eval(value);
                    }, 100);
                    break;
                  default:
                    break;
                }
              }
            );
          }
          else {
            this.userData = null;
          }
          // if (object.methodList !== undefined && object.methodList !== "") {
          //   this.methodList = JSON.parse(object.methodList);
          // }
          this.methodList = object.methodList;
          break;
        case "VuetifyKits.PartialLayout":
          object.layout.forEach(element => {
            this.replaceKeyword(element);
          },this);
          object.layout.forEach(element => {
            this.replaceElement(this.body, element);
          },this);
          this.$forceUpdate();
          break;
        case "Game.Client.resp":
          window.console.log(name + " received, active:" + object.active)
          switch (object.active) {
            case 'login': {
              if (object.status=='success') {
                let _dataInfo = JSON.parse(object.dataInfo);
                localStorage.setItem("userName", _dataInfo.userName);
                localStorage.setItem("seatId", _dataInfo.seatId);
                window.console.log("login successfully");
              }
              else {
                window.console.log("login failed, error code=" + object.error);
              }
              break;
            }
            case 'spin':
            case 'spinRound': 
            case 'clear': 
            {
              window.console.log("Game.Client.resp(" + object.active + ")");
              break;
            }
          }
          break;
        case "Game.Client.serverMessage":
          switch(object.messageId) {
              default:
                alert(JSON.stringify(object));
                break;
            }
            break;
        case "Game.Client.ExitApp":
          navigator.app.exitApp();
          break;
        case "Game.Client.Logout": {
          localStorage.removeItem("id");
          window.location.reload();
          break;
        }
        case "Game.Client.Redirect":
          if (window.WsClient) {
            this.body = Loading.layout,
            this.background =
              Loading.background.style +
              (Loading.background.src?"background-image:url(" +
              'getImageUrl(' + Loading.background.src + ')' +
              ");":";"),
            window.WsClient.socket.close();
            window.WsClient.socket = null;
            window.WsClient.url = '';
            this.connect(object.url);
          }
          break;
        case "Game.Client.Notification":
          var _notification_content = {
            title: object.title,
            text: this.translateContent(object.content),
            trigger: { at: new Date(new Date(object.time.substr(0, 19).replace(' ', 'T') + '+08:00').getTime()  + (object.remind  * 1000))},
            foreground: true
          };
          window.cordova.plugins.notification.local.schedule(_notification_content);
          break;
        default:
          break;
      }
    },
    todo: function() {
      var _interval_id = window.setInterval(() => {
        if (
          typeof window.WsClient !== "undefined" &&
          window.WsClient !== null &&
          typeof window.WsClient.WebEventProto != "undefined" &&
          window.WsClient.WebEventProto != null
        ) {
          window.clearInterval(_interval_id);
          window.console.log("add App.eventHandler");
          window.WsClient.addPacketInHandler(this.eventHandler);
          this.connect("localhost:8889");
        }
      }, 1000);
    },
    connect: function(url) {
      if (
        window.WsClient.socket === undefined ||
        window.WsClient.socket === null
      ) {
        window.WsClient.connectSocket(url);
      }
      // window.setTimeout(() => {
      var _interval_id = window.setInterval(() => {
        if (
          typeof window.WsClient.socket !== "undefined" &&
          window.WsClient.socket !== null
        ) {
          if (
            window.WsClient.socket.readyState !== window.WsClient.socket.OPEN
          ) {
            window.WsClient.connectSocket(url);
          } else {
            window.clearInterval(_interval_id);
            window.console.log("Connect successfully");
            let _ui_event = {
                id: localStorage.getItem("id"),
            };
            window.WsClient.PacketOut("Game.Client.login", _ui_event);
          }
        }
      }, 5000);
    },
    back_btn_clicked() {
      if (
        window.WsClient.socket === null ||
        window.WsClient.socket.readyState !== window.WsClient.socket.OPEN
      ) {
        navigator.app.exitApp();
      } else {
        var _ui_event = {
          active: "btn_back"
        };
        window.WsClient.PacketOut("Game.Client.clicked", _ui_event);
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
    getParameters: function() {
      const queryString = window.location.search;
      this.params = new URLSearchParams(queryString);
    }
  },
  mounted: function() {
    this.body.forEach(element => {
      this.replaceKeyword(element);
    },this);
    this.todo();
    document.addEventListener("backbutton", this.back_btn_clicked, false);
    this.getParameters();
  },
  beforeDestroy() {
    document.removeEventListener("backbutton", this.back_btn_clicked);
  }
};
</script>

<style src="./assets/styles/App.css"/>
