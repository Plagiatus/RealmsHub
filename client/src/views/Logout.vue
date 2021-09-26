<template>
		<div>
			<h1 class="loading">Logging you out...</h1>
			<div class="loading"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "@/components/request-mixin";

export default defineComponent({
	mixins: [request],
	async mounted() {
		let id = localStorage.getItem("id");
		if(id) {
			await this.sendRequest("/logout", "POST", {id});
		}
		localStorage.removeItem("id");
		localStorage.removeItem("user");
		window.location.replace("/");
	}
})
</script>
