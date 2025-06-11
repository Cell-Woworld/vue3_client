<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{elem.lable}}</span>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12">
                <div>{{computed_question_content}}</div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :id="elem.id" @click="confirm">{{computed_ok_content}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    elem: Object,
  },
  data: () => ({
    dialog: false,
    isFormValid: false, 
  }),
  methods: {
    confirm: function() {
      this.dialog = false;
      // window.console.log(this.elem.emitted + ', ' + this.elem.id + ", " + this.email + ', ' + this.password + ', ' + this.age);
      // this.$emit(this.elem.emitted, this.elem.id, [this.email, this.password, this.age]);

      if (window.WsClient.proto_root_ === undefined)
      {
        window.console.log('protobuf is not ready')
        return;
      }
      var _ui_event = {
        id: this.elem.id
      };
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);

      switch(this.elem.id)
      {
      case 'ask_reconnect_server':
        window.WsClient.socket = null;
        this.$root.connect();
        break;
      }
    }
  },
  computed: {
    computed_question_content() {
        var _obj = JSON.parse(this.elem.content);
        return _obj['question'];
    },
    computed_ok_content() {
        var _obj = JSON.parse(this.elem.content);
        return _obj['ok'];
    }
  }
};
</script>