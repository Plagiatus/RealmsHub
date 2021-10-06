<template>
	<button class="btn" :disabled="loading || success || disabled" :class="{loading: loading, light: light, red: red}" >{{textToDisplay}}</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: "LoadingButton",
	props: ["text", "loading", "successText", "light", "red", "disabled"],
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
