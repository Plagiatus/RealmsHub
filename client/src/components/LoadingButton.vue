<template>
	<button class="btn" :disabled="this.loading || this.success" :class="{loading: loading}">{{textToDisplay}}</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: "LoadingButton",
	props: ["text", "loading", "successText"],
	data() {
		return {
			success: false
		}
	},
	watch: {
		loading(newValue, oldValue) {
			if(!newValue){
				this.success = true;
				setTimeout(()=>{
					this.success = false;
				}, 1000)
			}
		}
	},
	computed: {
		textToDisplay(): string {
			if(this.success) return this.successText;
			if(this.loading) return "";
			return this.text;
		}
	}
})
</script>
