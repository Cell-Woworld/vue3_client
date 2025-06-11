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
      @click:row="(event, elem) => handleClickRow([event, elem.item])"
    >
      <template v-slot:[`item.tag`]="{ item }">
        <div
          v-show="item.tag == 'U'"
          class="ring-container"
        >
          <div class="ringing"></div>
          <div class="greenCircle"></div>
        </div>
        <div
          v-show="item.tag == 'R'"
          class="ring-container"
        >
          <div class="greyCircle"></div>
        </div>
        <div
          v-show="!item.tag"
        >
          <v-icon style="color:gold;">mdi-home-lightbulb-outline</v-icon>
        </div>
      </template>
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
  // eslint-disable-next-line no-unused-vars
  customFilter:function(value,search,item) {
    return value != null &&
        typeof value === 'string'  &&
        (!search || value.toString().indexOf(search) !== -1) && 
        (!item.filter || value.toString().indexOf(item.filter) !== -1);
  }
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
        _obj.filter = element.filter?this.customFilter:null;
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
              if (/^\w*([Dd]ate)(_?)([T|t]ime)\w*$/.test(key)) {
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
    }
  },
  methods: defaultMethods,
  mounted() {
    if (this.$root.methodList !== null && this.$root.methodList.length > 0) {
      this.$root.methodList.forEach(function (item) {
        if (item.component === "LabelledDataTable") {
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

<style scoped>
:deep().v-data-table .v-data-table__wrapper table thead tr th, 
:deep().v-data-table .v-data-table__wrapper table tbody tr td {
  font-size: 16px;
  padding: 0px 10px;
  height:1.8em;
  min-height:1.8em;
}

.ring-container {
    position: relative;
    margin:-8px 10px 0px;
}

.greyCircle {
    width: 15px;
    height: 15px;
    background-color: rgb(129, 129, 129);
    border-radius: 50%;
    position: absolute;
    top: 0px;
    left: 0px;
}

.greenCircle {
    width: 15px;
    height: 15px;
    background-color: #62bd19;
    border-radius: 50%;
    position: absolute;
    top: 0px;
    left: 0px;
}

.ringing {
    border: 3px solid #62bd19;
    height: 25px;
    width: 25px;
    position: absolute;
    top: -5px;
    left: -5px;
    animation: pulsate 5s ease-out;
    animation-iteration-count: infinite;
    border-radius: 30px;
    -webkit-animation: pulsate 5s ease-out;
    -webkit-animation-iteration-count: infinite; 
    -webkit-border-radius: 30px;
    opacity: 0.0
}
@keyframes pulsate {
    0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;}
    50% {opacity: 1.0;}
    100% {-webkit-transform: scale(1.2, 1.2); opacity: 0.0;}
}
@-webkit-keyframes pulsate {
    0% {-webkit-transform: scale(0.1, 0.1); opacity: 0.0;}
    50% {opacity: 1.0;}
    100% {-webkit-transform: scale(1.2, 1.2); opacity: 0.0;}
}
</style>