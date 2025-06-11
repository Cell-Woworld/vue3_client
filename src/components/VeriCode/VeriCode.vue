<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-col cols="12" sm="12" md="12" lg="12">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>簡訊驗證</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="isFormValid">
              <v-text-field
                label="請輸入4位數簡訊驗證碼"
                name="vericode"
                v-model="vericode"
                prepend-icon
                type="text"
                :rules="[rules.required, rules.vericode]"
              />
            </v-form>
          </v-card-text>
          <v-card-text style="color:red;font-size:larger;">{{elem.content}}</v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" id="SMS_abort" text @click="abort">返回</v-btn>
            <v-btn color="blue darken-1" id="SMS_resend_vericode" text @click="resend">重發驗證碼</v-btn>
            <v-btn color="primary" id="SMS_check_vericode" :disabled="!isFormValid" @click="verify">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    elem: Object
  },
  //Protocol_flag: true,
  data: () => ({
    dialog: true,
    isFormValid: true,
    vericode: "",
    rules: {
      required: value => !!value || "Required.",
      vericode: value => {
        const pattern = /^\d{4}$/;
        return pattern.test(value) || "不合法的驗證碼";
      }
    }
  }),
  methods: {
    abort: function(event) {
      if (window.WsClient.proto_root_ === undefined)
      {
        window.console.log('protobuf is not ready')
        return;
      }

      this.dialog = false;
      var _ui_event = {
        id: event.currentTarget.id
      };
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
    },
    resend: function(event) {
      if (window.WsClient.proto_root_ === undefined)
      {
        window.console.log('protobuf is not ready')
        return;
      }

      //this.dialog = false;
      var _ui_event = {
        id: event.currentTarget.id
      };
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
    },
    verify: function(event) {
      if (window.WsClient.proto_root_ === undefined) {
        window.console.log("protobuf is not ready");
        return;
      }

      //this.dialog = false;    // vericode may be incorrect  
      var _ui_event = {
        id: event.currentTarget.id
      };
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);

      // device_id will be translated to deviceId by protobufjs with some unknown reason
      _ui_event = {
        content: this.vericode
      };
      window.WsClient.PacketOut("SMS.Client.VeriCode", _ui_event);
    }
  }
};
</script>