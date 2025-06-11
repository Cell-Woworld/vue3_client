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
      v-model="selectedTask"
      :headers="computedHeaders"
      :items="computedRecordset"
      :hide-default-header="elem.dataTable.noHeader"
      :hide-default-footer="elem.dataTable.noFooter"
      :items-per-page="elem.dataTable.pageSize"
      class="elevation-1;"
      :height="elem.height"
      :search="search"
      :sort-by="computedSortBy"
    >
      <template v-slot:headers v-if="legacyIsMobileCheck() || elem.dataTable.noHeader"></template>
      <template v-slot:item="{ item, columns }">
        <div v-if="legacyIsMobileCheck() && !elem.dataTable.noRotation">
          <tr v-for="(col,colIndex) in columns" 
            :key="colIndex" 
            :style="'line-height:2.0;vertical-align:middle;width:100%;display:table;' + col.style"
            @click="handleClickRow(item)"
          >
            <td><span :style="col.style +'display:table-cell;text-align:left;font-weight:bold;'">{{col.text}}</span></td>
            <td 
              style= 'display:table-cell;text-align:-webkit-right;'
              :class="col.class"
            >
              {{item[col.value]}}
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
            {{item[col.value]}}
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
  handleClickRow(item) {
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
  // eslint-disable-next-line no-unused-vars
  handleUserData: function(item) {
  },
  legacyIsMobileCheck: function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  },
};

import * as labsComponents from 'vuetify/labs/components'

export default {
  components: {
    ...labsComponents,
  },
  props: {
    elem: Object
  },
  data: () => ({
    selectedTask: [],
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
                  ).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
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
              element[key] = Math.round(element[key]*100)/100;
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
    }
  },
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "DataTable") {
          this[item.functionName] = new Function("item", item.functionValue).bind(this);
        }
      }, this);
    }
    if (this.$root.userData) {
      this.handleUserData(this.$root.userData);
    }
  },
};
</script>

<style scoped>
:deep().v-data-table .v-data-table__wrapper table thead tr th, 
:deep().v-data-table .v-data-table__wrapper table tbody tr td {
  font-size: 16px;
  padding: 0px 10px;
  height:1.8em;
  min-height:1.8em;
}
</style>