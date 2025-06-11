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
              <v-col cols="12" style="font-size:32px;">
                <div>{{computed_question_content}}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field :label="computed_description_label" v-model="description" :rules="[rules.counter]"/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :id="elem.id" :disabled="!isFormValid" @click="confirm">{{computed_yes_content}}</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">{{computed_no_content}}</v-btn>
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
    description: '',
    rules: {
      counter: value => value.length <= 100 || "最多100個字"
    }
  }),
  methods: {
    confirm: function() {
      this.dialog = false;

      if (window.WsClient.proto_root_ === undefined)
      {
        window.console.log('protobuf is not ready')
        return;
      }
      if (this.description.length > 100) {
        this.description = this.description.substr(0, 100);
      }
      var _ui_event = {
        id: this.elem.id,
        content: this.description
      };
      window.WsClient.PacketOut("Generic.Client.Clicked", _ui_event);
    }
  },
  computed: {
    computed_question_content() {
        var _obj = JSON.parse(this.elem.content);
        return _obj['question'];
    },
    computed_yes_content() {
        var _obj = JSON.parse(this.elem.content);
        return _obj['yes'];
    },
    computed_no_content() {
        var _obj = JSON.parse(this.elem.content);
        return _obj['no'];
    },
    computed_description_label() {
        var _obj = JSON.parse(this.elem.content);
        return _obj['label'];
    }
  }
};
</script>