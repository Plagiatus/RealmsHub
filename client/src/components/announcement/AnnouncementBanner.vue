<template>
  <div id="announcement-banner" class="keep-dark">
		<div v-html="content"></div>
		<span @click="close" class="close"><img src="../../assets/x.svg" alt="close"></span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: ["content"],
	methods: {
		close() {
			this.$emit("close");
		},
	}
})
</script>



<style>

#announcement-banner {
	padding: 1em;
	background-color: var(--gold);
	color: var(--font-color);
}

@media screen and (max-width: 600px) {
	#announcement-banner {
		padding-top: 2.5em;
	}
}

</style>

<style scoped>

span.close {
	top: 0.5em;
}

</style>