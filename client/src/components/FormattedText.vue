<template>
  <span>{{ firstText }}<formatted-text :class="colors" v-if="remainingText.length > 0" :text="remainingText" />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "FormattedText",
  props: ["text"],
	data() {
		return {
			colorCodes: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "k", "l", "m", "n", "o", "r"],
		}
	},
  computed: {
    formattedText() {
      if (this.text) {
        return this.text.replaceAll(/§[0-9a-fk-or]/g, "");
      }
      return "";
    },
    colors() {
      let allCodes: string[] = this.text.match(/§[0-9a-fk-or]/g);
			if(allCodes.length == 0) return "";
      return allCodes[0];
    },
    firstText() {
      if (!this.text) return "";
      let allText: string[] = this.text.split(/§[0-9a-fk-or]/g);
			if(allText.length == 0) return "";
      return allText[0];
    },
    remainingText() {
      if (!this.text) return "";
			let matches: string[] = this.text.match(/§[0-9a-fk-or]/g);
			if(!matches || matches.length <= 0) {
				return "";
			}
			let indexOf: number = this.text.indexOf(matches[0]);
      return this.text.slice(indexOf + 2);
    }
  }
})
</script>

<style>
</style>