<template>
  <v-card
    :style="elem.style"
    v-if="!elem.invisible"
  >
    <v-card-title 
      v-if="elem.label || !elem.dataTable.noSearch"
      style="font-size:x-large;padding-left:0px;"
    >
      {{elem.label}}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        style="margin:0px;padding:0px;"
        label="Search"
        single-line
        hide-details
        v-if="!elem.dataTable.noSearch"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="computedHeaders"
      :items="computedRecordset"
      :hide-default-header="elem.dataTable.noHeader"
      :items-per-page="elem.dataTable.pageSize"
      :disable-pagination="!elem.dataTable.pageSize"
      class="elevation-1;"
      :height="elem.height"
      :search="search"
      :sort-by="computedSortBy"
      :mobile-breakpoint="elem.dataTable.noRotation?0:600"
      fixed-header
    >
      <template v-slot:headers v-if="legacyIsMobileCheck() || elem.dataTable.noHeader"></template>
      <template v-slot:item="{ item, columns }">
        <div v-if="legacyIsMobileCheck() && !elem.dataTable.noRotation">
          <tr v-for="(col,colIndex) in columns" 
            :key="colIndex" 
            :style="'line-height:2.0;vertical-align:middle;width:100%;display:table;' + col.style"
            @click="handleClickRow(item)">
            <td><span :style="col.style +'display:table-cell;text-align:left;'">{{col.text}}</span></td>
            <td 
              style= 'display:table-cell;text-align:-webkit-right;'
              :class="col.class"
            >
              <div
                v-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.text_list!==undefined && item.text_list.length>0 && item.text_list.indexOf(colIndex)>=0 || col.subcomponent=='div'"
                :style="item.style"
                @click="handleClick({'row':item,'col':col})"
              >{{item[col.value]}}</div>
              <v-select
                v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.select_list!==undefined && item.select_list.length>0 && item.select_list.indexOf(colIndex)>=0 || col.subcomponent=='v-select'"
                :items="item[col.value].items"
                :modelValue="item[col.value].value"
                :style="item.style"
                :multiple="item.multiple"
                v-model="item[col.value].value"
                item-title="text"
                item-value="value"
                hide-details
                @update:modelValue="handleChanged({'event':$event.target.value,'row':item,'col':col})"
              />
              <v-combobox
                v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.combobox_list!==undefined && item.combobox_list.length>0 && item.combobox_list.indexOf(colIndex)>=0 || col.subcomponent=='v-combobox'"
                :items="item[col.value].items"
                :modelValue="item[col.value].value"
                :style="item.style"
                v-model="item[col.value].value"
                item-title="text"
                item-value="value"
                hide-details
                @update:modelValue="handleChanged({'event':$event.target.value,'row':item,'col':col})"
              />
              <input
                v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.input_list!==undefined && item.input_list.length>0 && item.input_list.indexOf(colIndex)>=0 || col.subcomponent=='input'"
                :modelValue="item[col.value]"
                :style="item.style + ';border-bottom:solid thin #0000002e;'"
                :type="col.type"
                :min="col.min"
                :max="col.max"
                :step="col.step"
                @change="handleChanged({'event':$event.target.value,'row':item,'col':col})"
              />
              <v-text-field
                v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.textfield_list!==undefined && item.textfield_list.length>0 && item.textfield_list.indexOf(colIndex)>=0 || col.subcomponent=='v-text-field'"
                :modelValue="item[col.value].value"
                :style="item.style"
                :label="col.label"
                :type="col.type"
                :min="col.min"
                :max="col.max"
                :step="col.step"
                @change="handleChanged({'event':$event.target.value,'row':item,'col':col})"
                @click:control="handleClick({'row':item,'col':col})"
                @update:modelValue="handleInput({'event':$event,'row':item,'col':col})"
                @keydown.enter="handleEnter({'event':$event.target.value,'row':item,'col':col})"
                hide-details
              />
              <v-textarea
                v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.textarea_list!==undefined && item.textarea_list.length>0 && item.textarea_list.indexOf(colIndex)>=0 || col.subcomponent=='v-textarea'"
                :modelValue="item[col.value].value"
                :label="item[col.value].label"
                :style="item.style"
                auto-grow
                rows=3
                @change="handleChanged({'event':$event,'row':item,'col':col})"
                hide-details
              />
              <v-btn
                v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.btn_list!==undefined && item.btn_list.length>0 && item.btn_list.indexOf(colIndex)>=0 || col.subcomponent=='v-btn'"
                :style="item.style"
                @click="handleClick({'row':item,'col':col})"
              >{{item[col.value]}}</v-btn>
              <v-checkbox
                v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.checkbox_list!==undefined && item.checkbox_list.length>0 && item.checkbox_list.indexOf(colIndex)>=0 || col.subcomponent=='checkbox'"
                v-model="item[col.value]"
                :modelValue="item[col.value]"
                :style="item.style"
                @change="handleChanged({'event':$event,'row':item,'col':col})"
              ></v-checkbox>
              <v-icon
                v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.icon_list!==undefined && item.icon_list.length>0 && item.icon_list.indexOf(colIndex)>=0 || col.subcomponent=='v-icon'"
                :style="item.style"
                @click="handleClick({'row':item,'col':col})"
              >{{item[col.value]}}</v-icon>
              <img 
                v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.img_list!==undefined && item.img_list.length>0 && item.img_list.indexOf(colIndex)>=0 || col.subcomponent=='img'"
                :src="item[col.value]" 
                :style="col.style"
                :alt="col.text"
                @click="handleClick({'row':item,'col':col})"
              />
              <span
                v-if="item.bool_list!==undefined && item.bool_list.length>0 && item.bool_list.indexOf(colIndex)>=0 || col.subcomponent=='bool'"
                :style="item.style"
                @click="handleClick({'row':item,'col':col})"
              >{{translateContent({'row':item,'col':col,'type':'bool_list'})}}</span>
              <Section_L2
                v-if="item.section_list!==undefined && item.section_list.length>0 && item.section_list.indexOf(colIndex)>=0 || col.subcomponent=='Section_L2'"
                :elem="item[col.value]"
                :modelValue="item"
              />
            </td>
          </tr>
          <v-divider style="margin-top:10px;margin-bottom:10px"/>
        </div>
        <tr v-else
          @click="handleClickRow(item)"
        >
          <td v-for="(col,colIndex) in columns" 
            :key="colIndex"
            :class="col.class"
            :style="col.style"
          >
            <span
              v-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.header_list!==undefined && item.header_list.length>0 && item.header_list.indexOf(colIndex)>=0 || col.subcomponent=='header'"
              style="font-weight:bold;"
              @click="handleClick({'row':item,'col':col})"
            >{{item[col.value]}}</span>
            <div
              v-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.text_list!==undefined && item.text_list.length>0 && item.text_list.indexOf(colIndex)>=0 || col.subcomponent=='div'"
              :style="item.style"
              @click="handleClick({'row':item,'col':col})"
            >{{item[col.value]}}</div>
            <v-select
              v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.select_list!==undefined && item.select_list.length>0 && item.select_list.indexOf(colIndex)>=0 || col.subcomponent=='v-select'"
              :items="item[col.value].items"
              :modelValue="item[col.value].value"
              :style="item.style"
              v-model="item[col.value].value"
              item-title="text"
              item-value="value"
              hide-details
              @update:modelValue="handleChanged({'event':$event.target.value,'row':item,'col':col})"
            />
            <v-combobox
              v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.combobox_list!==undefined && item.combobox_list.length>0 && item.combobox_list.indexOf(colIndex)>=0 || col.subcomponent=='v-combobox'"
              :items="item[col.value].items"
              :modelValue="item[col.value]"
              :style="item.style"
              v-model="item[col.value].value"
              item-title="text"
              item-value="value"
              hide-details
              @update:modelValue="handleChanged({'event':$event.target.value,'row':item,'col':col})"
            />
            <input
              v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.input_list!==undefined && item.input_list.length>0 && item.input_list.indexOf(colIndex)>=0 || col.subcomponent=='input'"
              :modelValue="item[col.value]"
              :style="item.style + ';border-bottom:solid thin #0000002e;'"
              :type="col.type"
              :min="col.min"
              :max="col.max"
              :step="col.step"
              @change="handleChanged({'event':$event.target.value,'row':item,'col':col})"
            />
            <v-text-field
              v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.textfield_list!==undefined && item.textfield_list.length>0 && item.textfield_list.indexOf(colIndex)>=0 || col.subcomponent=='v-text-field'"
              :modelValue="item[col.value]"
              :style="item.style"
              :label="col.label"
              :type="col.type"
              :min="col.min"
              :max="col.max"
              :step="col.step"
              @change="handleChanged({'event':$event.target.value,'row':item,'col':col})"
              @click:control="handleClick({'row':item,'col':col})"
              @update:modelValue="handleInput({'event':$event,'row':item,'col':col})"
              @keydown.enter="handleEnter({'event':$event.target.value,'row':item,'col':col})"
              hide-details
            />
            <v-textarea
              v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.textarea_list!==undefined && item.textarea_list.length>0 && item.textarea_list.indexOf(colIndex)>=0 || col.subcomponent=='v-textarea'"
              :modelValue="item[col.value].value"
              :label="item[col.value].label"
              :style="item.style"
              auto-grow
              rows=3
              v-model="item[col.value].value"
              @change="handleChanged({'event':$event.target.value,'row':item,'col':col})"
              hide-details
            />
            <v-btn
              v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.btn_list!==undefined && item.btn_list.length>0 && item.btn_list.indexOf(colIndex)>=0 || col.subcomponent=='v-btn'"
              :style="item.style"
              @click="handleClick({'row':item,'col':col})"
            >{{item[col.value]}}</v-btn>
            <v-checkbox
              v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.checkbox_list!==undefined && item.checkbox_list.length>0 && item.checkbox_list.indexOf(colIndex)>=0 || col.subcomponent=='v-checkbox'"
              v-model="item[col.value]"
              :modelValue="item[col.value]"
              :style="item.style"
              @change="handleChanged({'event':$event.target.value,'row':item,'col':col})"
            ></v-checkbox>
            <v-icon
              v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.icon_list!==undefined && item.icon_list.length>0 && item.icon_list.indexOf(colIndex)>=0 || col.subcomponent=='v-icon'"
              :style="item.style"
              @click="handleClick({'row':item,'col':col})"
            >{{item[col.value]}}</v-icon>
            <img 
              v-else-if="(!col.invisible || col.invisible=='false' || col.invisible == '0') && item.img_list!==undefined && item.img_list.length>0 && item.img_list.indexOf(colIndex)>=0 || col.subcomponent=='img'"
              :src="item[col.value]" 
              :style="col.style"
              :alt="col.text"
              @click="handleClick({'row':item,'col':col})"
            />
            <span
              v-if="item.bool_list!==undefined && item.bool_list.length>0 && item.bool_list.indexOf(colIndex)>=0 || col.subcomponent=='bool'"
              :style="item.style"
              @click="handleClick({'row':item,'col':col})"
            >{{translateContent({'row':item,'col':col,'type':'bool_list'})}}</span>
            <Section_L2
              v-if="item.section_list!==undefined && item.section_list.length>0 && item.section_list.indexOf(colIndex)>=0 || col.subcomponent=='Section_L2'"
              :elem="item[col.value]"
              :modelValue="item"
            />
          </td>
        </tr>
      </template>
      <template v-slot:bottom v-if="elem.dataTable.noFooter"></template>
    </v-data-table>
  </v-card>
</template>

<script>
var defaultMethods = {
// eslint-disable-next-line no-unused-vars
  handleClickRow(row) {
  },
  handleClick(item) {
    // eslint-disable-next-line no-unused-vars
    const {row,col} = item;
    if (!col) {
      return;
    }
    switch (col.value)
    {
      default:
        break;
    }
  },
  handleChanged(item) {
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const {event,row,col} = item;
    switch(this.elem.id) {
      default:
        break;
    }
  },
  handleInput(item) {
    const {event,row,col} = item;
    this.value=event;
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }
    // eslint-disable-next-line no-unused-vars
    switch(this.elem.id) {
      default:
        break;
    }
  },
  handleEnter(item) {
    if (window.WsClient.proto_root_ === undefined) {
      window.console.log("protobuf is not ready");
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const {event,row,col} = item;
    switch(this.elem.id) {
      default:
        break;
    }
  },
  // eslint-disable-next-line no-unused-vars
  handleUserData: function(item) {
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
  legacyIsMobileCheck: function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  },
  isMobile: function() {
    const _uaDataIsMobile = window.navigator.userAgentData?.mobile
    const _isMobile = typeof _uaDataIsMobile === 'boolean'
      ? _uaDataIsMobile
      : this.legacyIsMobileCheck();
    window.console.log('uaDataIsMobile: ' + _uaDataIsMobile + ', isMobile: ' + _isMobile);
    return _isMobile;
  },
};

import * as labsComponents from 'vuetify/labs/components'
import Section_L2 from "@/components/Section/Section_L2.vue";

export default {
  components: {
    ...labsComponents,
    Section_L2,
  },
  props: {
    elem: Object
  },
  data: () => ({
    itemList_:{},
    search: null,
}),
  computed: {
    computedHeaders() {
      this.elem.dataTable.headers.forEach(element => {
        var _obj = element;
        _obj.sortable = element.sortable == false ? false : true;
        _obj.title = element.text;
        _obj.key = element.value;
        _obj.align = element.align;
        // delete _obj.text;
        // delete _obj.value;
      });
      return this.elem.dataTable.headers;
    },
    computedRecordset() {
      if (this.elem.dataTable.recordset === "") return [];
      else { 
        const DATETIME_RULE = /^\d\d\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])[T| ](0[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])($|Z$| [+-](0[0-9]|1[0-2])\d\d$)/;
        const BOOLEAN_RULE = /^(?:(1|y(?:es)?|t(?:rue)?|on)|(0|n(?:o)?|f(?:alse)?|off))$/i;
        const DECIMAL_NUMBER_RULE = /^\d+\.\d+$/;
        const NUMBER_RULE = /^\d+$/;
        var _recordset = JSON.parse(this.elem.dataTable.recordset);
        _recordset.forEach((element) => {
          Object.entries(
            element
          ).forEach(([key, value]) => {
            if (typeof value != 'string')
              return;
            if (value.match(DATETIME_RULE)) {
              if (/^\w*([Dd]ate)(_?)([Tt]ime)\w*$/.test(key)) {
                  element[key] = new Date(
                    element[key].substr(0, 19).replace(' ', 'T') + "Z"
                  ).toLocaleString().slice(0,-3);
              }
              else if (/^\w*([Dd]ate)\w*$/.test(key)) {
                  element[key] = new Date(
                    element[key].substr(0, 19).replace(' ', 'T') + "Z"
                  ).toLocaleDateString();
              }
              else if (/^\w*([Tt]ime)\w*$/.test(key)) {
                  element[key] = new Date(
                    element[key].substr(0, 19).replace(' ', 'T') + "Z"
                  ).toLocaleTimeString('en-GB').slice(0,-3);
              }
            }
            else if (value.match(BOOLEAN_RULE) && /^(Is|is|Has|has)\w*$/.test(key)) {
              element[key] = /^(?:1|y(?:es)?|t(?:rue)?|on)$/i.test(value);
            }
            else if (value.match(DECIMAL_NUMBER_RULE) && /^\w*([Dd]iscount|[Pp]ercent)\w*$/.test(key)) {
              element[key] = element[key] * 100 + '%';
            }
            else if (value.match(DECIMAL_NUMBER_RULE) && /^\w*([Ff]loat|[Dd]ouble)\w*$/.test(key)) {
              element[key] = (Math.round(element[key]*100)/100).toFixed(2);
            }
            else if (value.match(DECIMAL_NUMBER_RULE) && /^\w*([Ii]nteger)\w*$/.test(key)) {
              element[key] = Math.round(element[key]);
            }
            else if (value.match(NUMBER_RULE) && /^\w*([Pp]ad[Ii]nteger8)\w*$/.test(key)) {
              element[key] = element[key].padStart(8,0);
            }
            else if (/^\w*(JSON|json)2([Ll]ist)\w*$/.test(key)) {
              let _content = '';
              element[key].split('#').forEach(element => {
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
              element[key] = _content;
            }
          });
        });

        return _recordset;
      }
    },
    computedSortBy() {
      let _content = [];
      this.elem.dataTable.sortBy.forEach( (element,index) => {
        _content.push({key:element, order:this.elem.dataTable.sortDesc[index]?'desc':'asc'});
      });
      return _content;
    },
  },
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "Editable_DataTable") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
    if (this.$root.userData) {
      this.handleUserData(this.$root.userData);
    }
  }
}
</script>

<style>
.v-data-table .v-data-table__wrapper table thead tr th,
.v-data-table .v-data-table__wrapper table tbody tr td {
  font-size: 16px;
  padding: 0px 10px;
}
.v-data-table .v-data-table__wrapper table tbody tr .fixed {
    position: sticky !important;
    position: -webkit-sticky !important;
    z-index: 9998;
    background: white;
    left: var(--left,0px);
  }
.v-data-table .v-data-table__wrapper table thead tr .fixed {
    z-index: 9999;
    position: sticky !important;
    position: -webkit-sticky !important;
    background: white;
    left: var(--left,0px);
  }
</style>