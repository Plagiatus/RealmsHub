<template>
  <div class="home">
		<h1>Realms Hub</h1>
		<span class="affiliation">Not affiliated to or endored by Mojang or Microsoft.</span>
    <img class="logo" alt="Vue logo" src="../assets/logo.png">
		<div>
			<div id="login">
				<h3>Login</h3>
				<a href="/login"><img class="login" src="../assets/ms-symbollockup_signin_light.svg" alt="Login with Microsoft"></a>
				<span>Don't have a Microsoft Account?<br> Use the <a href="https://plagiatus.net/tools/realmadmin">old page</a>.</span>
			</div>

		</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {}
</script>

<style scoped>
	img.logo {
		width: 200px;
		height: 200px;
	}

	#login {
		padding: 1em;
		background-color: var(--highlight);
		z-index: 10;
		border-radius: 1em;
		color: var(--foreground);
	}

	#login span {
		display: block;
		margin-top: 1em;
	}

	#login img {
		cursor: pointer;
	}

	span.affiliation {
		display: block;
		margin-bottom: 1em;
		font-style: italic;
	}
</style>