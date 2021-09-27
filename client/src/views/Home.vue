<template>
  <div class="home">
		<h1>Realms Hub</h1>
		<span class="affiliation">Not affiliated to or endorsed by Mojang or Microsoft.</span>
    <img class="logo" alt="Vue logo" src="../assets/logo.png">
		<div class="preview-note"><span><strong>Please note:</strong><br> This Page is currently under active development and barely in an <strong>alpha</strong> state. <br>Expect things to break or not be finished.</span></div>
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
import { Vue } from 'vue-class-component';

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

	.preview-note {
		margin: 2em 0;
		padding: 0.5em;
		border: 2px solid var(--red);
		border-radius: 1em;
		background-color: rgb(255, 238, 238);
	}
</style>