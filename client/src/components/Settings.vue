<template>
  <div id="page-settings">
    <h3>Page Settings</h3>
    <label for="darkmode">Darkmode</label>
    <input
      type="checkbox"
      name="darkmode"
      id="darkmode"
      class="toggle"
      v-model="pageSettings.darkMode"
    />
    <h3>🍪 Cookie Settings</h3>
    <span class="italic" style="font-size: 0.8em">No settings here yet. Only functional cookies that cannot be turned off.</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import settings, { CookieSettings, PageSettings } from "./settings-mixin";

export default defineComponent({
  mixins: [settings],
	data(){
		return {
			justSent: false,	 
		}
	},
  methods: {
    loadSettings() {
      //
    },
    saveSettings() {
      //
    }
  },
  watch: {
    pageSettings: {
			deep:true,
			handler(newValue: PageSettings) {
				localStorage.setItem("pageSettings", JSON.stringify(this.pageSettings));
				// if (JSON.stringify(newValue) == JSON.stringify(oldValue)) return;
				if(this.justSent){
					this.justSent = false;
					return;
				}
				this.justSent = true;
				window.dispatchEvent(new CustomEvent("updatedSettings"));
			}
    },
    cookieSettings(newValue: CookieSettings) {
      localStorage.setItem("cookieSettings", JSON.stringify(this.cookieSettings));
      // if (JSON.stringify(newValue) == JSON.stringify(oldValue)) return;
      // window.dispatchEvent(new CustomEvent("updatedSettings"));
    }
  },
})
</script>

<style>
#page-settings {
  position: absolute;
  bottom: 100%;
  text-align: left;
  background-color: var(--foreground);
  border: 1px solid var(--background);
  padding: 1em;
  margin-bottom: 20px;
  right: 5px;
  border-radius: 1em;
	width: 300px;
}

#page-settings::after {
  content: " ";
  position: absolute;
  top: 100%;
  right: 10px;
  border: 20px solid transparent;
  border-top-color: var(--foreground);
}
</style>