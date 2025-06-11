<template>
  <v-row class="chat-footer" :class="{ 'footer-float': float }" no-gutters>
    <v-col>
      <v-form v-model="valid" v-on:submit.prevent ref="userInputForm">
        <v-container class="fill-height py-0">
          <v-row no-gutters align="center" justify="center">
            <v-col class="text-center">
              <v-textarea
                id="chat-input-field"
                aria-label="Chat bot send message"
                :disabled="textFieldDisabledCondition"
                @keyup.esc="handleEscapeKey"
                :prepend-inner-icon="innerIconCondition"
                type="text"
                :rules="inputRules"
                :clearable="!isUserInputEmpty"
                clear-icon="mdi-comment-remove-outline"
                auto-grow
                color="sendButton"
                required
                solo
                tabindex="0"
                return-masked-value
                name="userInput"
                ref="userInput"
                autocomplete="off"
                v-model.lazy="userInput"
                :label="determineLabelText"
                data-lpignore="true"
                rows="1"
              >
              </v-textarea>
            </v-col>
            <v-col cols="3" sm="2" class="text-center">
              <template>
                <v-btn
                  text
                  icon
                  tabindex="0"
                  :disabled="isUserInputEmpty"
                  :loading="progressBar"
                  aria-label="Send"
                  large
                  @click.native="sendUserInput"
                >
                  <v-icon color="sendButton">mdi-send</v-icon>
                </v-btn>
              </template>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>

// import { VTextarea } from "vuetify/lib";
export default {
  name: "ChatInput",
  props: ["passUserInput", "handleInputFocus", "sendParams", "mustSend", "drawer"],
  directives: {
    // "long-press": LongPress,
    // mask
  },
  components: {
    // VTextarea
  },
  data: () => ({
    userInput: "",
    interval: {},
    audioButtonColor: "sendButton",
    audioInFocus: false,
    progressValue: 0,
    showPassword: false,
    rules: {
      required: value => !!value || "Required.",
      counter: value => (value===null || value.length <= 300) || "Max 300 characters",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      }
    },
    valid: false,
    float: true,
    progressBar: false,
  }),
  watch: {
    storeUserInput: function(storeInput) {
      if (this.userInput !== storeInput) {
        this.userInput = storeInput;
      }
    },
    drawer: function(newDrawer) {
      if (!newDrawer) {
        this.handleFocus();
      }
    },
    dialogs: function() {
      this.handleFocus();
    },
    mustSend: function(mustSend) {
      if (mustSend) {
        this.valid = true;
        this.sendUserInput();
      }
    },
    handleInputFocus: function(shouldFocus) {
      if (shouldFocus) {
        this.handleFocus();
      }
    },
   passUserInput: function(newInput) {
      if (newInput) {
        this.userInput = newInput;
      }
    },
    userInputReadyForSending: function(readyForSend) {
      if (readyForSend) {
        this.valid = true;
        this.sendUserInput();
      }
    }
  },
  mounted() {
    this.handClearIconClick();
    const element = this.$el.querySelector("#chat-input-field");

    if (!this.isMobileDevice) {
      if (element) {
        this.$nextTick(() => {
          // this.$refs.userInput.focus(); // possibly duplicated below
          element.addEventListener("focusin", e => e.stopPropagation()); // to stop flickering
          element.focus();
        });
      }
    } else {
      element.addEventListener("focusin", e => e.stopPropagation()); // to stop flickering
      document.activeElement.blur();
    }
  },
  created() {
    this.handleFocus();
  },
  computed: {
    determineLabelText() {
      return this.inputHelpText
    },
    innerIconCondition() {
      return this.askingForPassword ? (this.showPassword ? "mdi-eye" : "mdi-eye-off") : "";
    },
    textFieldDisabledCondition() {
      return this.progressBar || this.drawer;
    },
    // shouldDisableSend() {
    //   return this.progressBar || this.userInput === "" || this.userInput === null;
    // },
    inputRules() {
      //return this.askingForEmail ? [this.rules.email(this.userInput)] : [];
      return [this.rules.counter];
    },
    isUserInputEmpty() {
      return this.userInput === null || this.userInput.trim() === "";
    },
    // storeUserInput() {
    //   return this.$store.getters.userInput;
    // }
  },
  methods: {
    handClearIconClick() {
      let clearElements = document.getElementsByClassName("v-icon--link");
      clearElements.forEach(clearElement => {
        let parentEl = clearElement.parentElement;
        if (parentEl.classList.contains("v-input__icon--clear")) {
          clearElement.tabIndex = 0;
          clearElement.setAttribute("aria-label", "Clear Chat");
          clearElement.addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
              clearElement.click();
            }
          });
        }
      });
    },
    hideProgressBar() {
      // this.$store.commit("HIDE_PROGRESS_BAR");
    },
    sendUserInput() {
      if (this.valid) {
        if (this.userInput !== undefined && this.userInput !== '' && this.userInput.trim()) {
          if (this.userInput.length > 300)
            this.userInput = this.userInput.substr(0, 300); 
          var _ui_event = {
            content: this.userInput
          };
          window.WsClient.PacketOut(
            "ChatRoom.Client.NewPost",
            _ui_event
          );
          this.userInput = '';
        }
      }
    },
    handleFocus() {
      setTimeout(() => {
        let theInputElement = document.getElementById("chat-input-field");
        if (theInputElement && !this.isMobileDevice) {
          // this.$refs.userInput.focus();
          theInputElement.focus();
          // logger.debug(`Handling focus`);
        } else if (
          theInputElement &&
          this.isMobileDevice &&
          document.activeElement === theInputElement
        ) {
          document.activeElement.blur();
        }
      }, 300);
    },
    updateInputBox(userInput) {
      // logger.debug(`Updating Input Box`);
      this.userInput = userInput;
      if (!this.isMobileDevice) {
        this.$refs.userInput.focus();
      } else {
        document.activeElement.blur();
      }
    },
    handleEscapeKey() {
    },
    showImage(files) {
      // if (files.length > 1) {
      this.files = [];
      /** Solution provided by Chem **/
      /* const test = */
      Array.from(files).forEach((file, idx) => {
        const fileReader = new FileReader();
        const getResult = new Promise(/*resolve*/() => {
          fileReader.onload = e => {
            this.files.push({
              id: idx,
              url: e.target.result
            });
          };
        });

        fileReader.readAsDataURL(file);
        return getResult.then(file => {
          return file;
        });
      });
      // }
      /*
      } else {
        const fileReader = new FileReader();
        fileReader.onload = e => {
          this.files[0].id = 1;
          this.files[0].url = e.target.result;
        };
        fileReader.readAsDataURL(files[0]);
      }
      */
      
    }
  }
};
</script>
<style></style>
