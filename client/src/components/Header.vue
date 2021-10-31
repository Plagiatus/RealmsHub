<template>
  <div class="header">
		<!-- <div class="header" id="page-top">
			<span class="page-title">RealmsHub</span>
		</div> -->
		<nav class="mainmenu" v-if="loggedIn">
			<router-link to="/overview" class="mainmenu-item" id="header-overview">Overview</router-link>
			<div class="header-splitter"></div>
			<router-link to="/logout" id="header-logout" class="keep-dark" >Logout <img src="../assets/logout.svg" alt=""></router-link>
		</nav>
		<router-link to="/login" id="header-login" v-else><img src="../assets/ms-symbollockup_signin_light.svg" alt=""></router-link>
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

<style>
.header {
	width: 100%;
}

#page-top {
	background-color: var(--background);
	margin-bottom: 1em;
}

.page-title {
	margin: 1rem;
	font-size: 2em;
}

.mainmenu {
	position: fixed;
	top: -1em;
	right: 1em;
	font-size: 1.5em;
	padding-top: 1em;
	background-color: var(--foreground);
	border: 3px solid var(--highlight);
	border-radius: .5rem;
	z-index: 1000;
}

.mainmenu a {
	padding: 0.4em;
	color: inherit;
	text-decoration: none;
	user-select: none;
	display: inline-block;
}

.header-splitter {
	height: 2em;
	margin: -.7em 0em;
	display: inline-block;
	border: 2px solid var(--highlight);
}

#header-logout {
	background-color: var(--btn-light-green);
	border-bottom-right-radius: .5rem;
}

#header-logout img {
	width: .7em;
	height: .7em;
}


#header-login {
	position: fixed;
	top: -1em;
	right: 1em;
	padding-top: 1.5em;
}
</style>