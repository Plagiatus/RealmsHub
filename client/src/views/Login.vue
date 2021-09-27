<template>
  <div>
    <h1>You are now being logged in.</h1>
		<div class="loading"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../components/request-mixin";

export default defineComponent({
	mixins: [request],
	async mounted() {
		let id = localStorage.getItem("id");
		if(id) {
			let result: string | undefined = await this.sendRequest("/check-login", "POST", {id});
			if(result != undefined) {
				window.location.assign("/overview");
				return;
			}
		}
		let response: string | undefined = await this.sendRequest("/login", "GET", null, () => {
			window.location.assign("/");
		});
		if(response) {
			window.location.assign(response);
		}
	}
});
</script>