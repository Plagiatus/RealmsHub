<template>
	<span>{{formattedText}}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: "FormattedText",
	props: ["text"],
	computed: {
		formattedText() {
			if(this.text) {
				return this.text.replaceAll(/§./g, "");
			}
			return "";
		}
	}
})
</script>

<style>

</style>