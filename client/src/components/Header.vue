<template>
  <div id="header">
		<span>RealmsHub</span>
		<router-link v-if="loggedIn" to="/logout">Logout</router-link>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Header",
  data() {
    return {
      
    };
  },
	computed: {
		loggedIn() {
			let id = localStorage.getItem("id");
			if(id) return true;
			return false;
		}
	},
});
</script>
