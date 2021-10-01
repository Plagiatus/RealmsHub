<template>
  <div>
    <h1>Microsoft login completed.</h1>
    <p>Please stand by while your login is processed.</p>
		<div class="loading" style="position: relative; margin-top: 1em"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "@/components/request-mixin";

export default defineComponent({
	mixins:[request],
  async mounted() {
    let url = new URL(window.location.href);
    let code = url.searchParams.get("code");
    if (!code) {		
      window.dispatchEvent(new CustomEvent("displayError", { 
				detail: {
					code: 401,
					message: "No authorization recieved.",
					dismissEvent: ()=>{window.location.replace("/")}
				}
			}))
      return;
    }

		let result: string|undefined = await this.sendRequest("/login", "POST", {code}, undefined, ()=>{window.location.replace("/")});
		if(!result){
			return;
		}
		let id = JSON.parse(result);
		if(id.id){
			localStorage.setItem("id", id.id);
			localStorage.setItem("user", id.username);
			window.location.replace("/overview");
		}
  },
});
</script>