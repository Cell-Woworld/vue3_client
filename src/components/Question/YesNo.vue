<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{elem.lable}}</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="isFormValid">
            <v-row>
              <v-col cols="12">
                <div>{{computed_question_content}}</div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :id="elem.id"
            :disabled="!isFormValid"
            @click="confirm"
          >{{computed_yes_content}}</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">{{computed_no_content}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    elem: Object
  },
  data: () => ({
    dialog: false,
    isFormValid: false
  }),
  methods: {
    confirm: function() {
      this.dialog = false;
      // window.console.log(this.elem.emitted + ', ' + this.elem.id + ", " + this.email + ', ' + this.password + ', ' + this.age);
      // this.$emit(this.elem.emitted, this.elem.id, [this.email, this.password, this.age]);

      if (window.WsClient.proto_root_ === undefined) {
        window.console.log("protobuf is not ready");
        return;
      }
      var _ui_event = {
        id: this.elem.id
      };
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);

      switch (this.elem.id) {
        case "app_punch_in_again":
          var _obj = JSON.parse(this.elem.content);
          if (window.deviceId !== "00000000-0000-0000-0000-000000000000") {
            navigator.geolocation.getCurrentPosition((position) => {
              _ui_event = {
                id: _obj["id"],
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              window.WsClient.PacketOut("Punch.Client.PunchIn", _ui_event);
            }, (error) => {
              //show no GPS dialog
              window.console.log('no GPS: ' + 'code: ' + error.code + ', message: ' + error.message);
              this.$root.$refs.app_punch_no_gps[0].dialog = true;
            },{timeout: 30000, maximumAge: 0, enableHighAccuracy: true});
          }
          else {
              _ui_event = {
                id: _obj["id"],
                latitude: 24.092270,
                longitude: 120.395820
              };
              window.WsClient.PacketOut("Punch.Client.PunchIn", _ui_event);
          }
          break;
        default:
          break;
      }
    },
    translateDateTime: function(content) {
      if (content !== '') {
        var new_content = new Date(
          content.substr(0, 19).replace(' ', 'T') + "Z"
        ).toLocaleString().slice(0,-3);
        return new_content;
      } else {
        return '';
      }
    }
  },
  computed: {
    computed_question_content() {
      var _obj = JSON.parse(this.elem.content);
      var _ret = _obj["question"];
      if (_obj["value"] !== undefined) {
        var localeDateTime = this.translateDateTime(_obj["value"]);
        if (localeDateTime !== '') {
          _ret = _ret.replace(_obj["value"], localeDateTime);
        }
      }
      return _ret;
    },
    computed_yes_content() {
      var _obj = JSON.parse(this.elem.content);
      return _obj["yes"];
    },
    computed_no_content() {
      var _obj = JSON.parse(this.elem.content);
      return _obj["no"];
    }
  }
};
</script>