<template>
  <div>
    <h1>You are now being logged in.</h1>
		<div class="loading"></div>
  </div>
</template>

<script lang="ts">
// import * as https from "https";
import { defineComponent } from "vue";

export default defineComponent({
	async mounted() {
		let id = localStorage.getItem("id");
		if(id) {
			let response: Response = await fetch("http://localhost:9001/check-login", {
				method: "POST",
				body: JSON.stringify({id}),
				headers: { "Content-Type": "application/json"},
			});
			if(response.status == 200) {
				window.location.assign("/overview");
				return;
			}
		}
		let response: Response = await fetch("http://localhost:9001/login");
		let result: string = await response.text();
		window.location.assign(result);
	}
});
</script>