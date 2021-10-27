<template>
  <div id="error-wrapper-outer" v-if="visible">
    <div id="error-wrapper">
      <span id="error-code">{{ code }}</span>
      <h2>An Error occurred</h2>
      <p id="error-message">{{ message }}</p>
      <p id="error-info">
        If this keeps happening, please inform the administrators of this
        website.
      </p>
      <button class="btn light" @click="dismiss">Dismiss</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorDisplay",
  data() {
    return {
      visible: false,
      message: "Generic Error",
      code: 500,
      dismissEvent: this.dismissEventFunction,
    };
  },
  methods: {
    showError(_error: ErrorDetails) {
      this.message = _error.message || "Error";
      this.code = _error.code || 500;
      this.dismissEvent = _error.dismissEvent;
      this.visible = true;
    },
    dismiss() {
      this.visible = false;
      if (this.dismissEvent) {
        this.dismissEvent();
      }
    },
		dismissEventFunction(){
			return;
		}
  },
  mounted() {
    window.addEventListener("displayError", (error: any) => {
      this.showError(error.detail);
		});
  },
});

interface ErrorDetails {
	message: string,
	code: number,
	dismissEvent: ()=>void;
}

// interface ErrorEvent {
// 	detail: ErrorDetails;
// }

</script>

<style>
#error-wrapper-outer {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  z-index: 10000;
}

#error-wrapper {
  background-color: var(--background);
  padding: 1em;
  max-width: 500px;
  min-width: 300px;
  border-radius: 1em;
  position: relative;
}

#error-info {
  font-size: 0.8em;
  font-style: italic;
  position: relative;
  z-index: 1;
}
#error-message {
  position: relative;
  z-index: 1;
}

#error-code {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: rgba(0, 0, 0, 0.05);
  font-size: 7em;
  user-select: none;
  z-index: 0;
}

body.dark #error-code {
	color: rgba(255, 255, 255, 0.05)
}
</style>