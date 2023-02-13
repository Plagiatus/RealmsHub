<template>
  <div class="home">
		<h1>Realms Hub</h1>
		<span class="affiliation">Not affiliated to or endorsed by Mojang or Microsoft.</span>
    <img class="logo" alt="Vue logo" src="../assets/logo.png">
		<!-- <div class="preview-note"><span><strong>Please note:</strong><br> This Page is currently under active development and considered to be in <strong>BETA</strong>.<br>That means everything should work, but sometimes might not.<br>Expect things to occasionally break or not be finished. If you find a bug, please <a href="https://github.com/Plagiatus/RealmsHub/issues" target="_blank" rel="noopener noreferrer">report it.</a></span></div> -->
		<div>
			<div id="login">
				<h3>Login</h3>
				<a href="/login"><img class="login" src="../assets/ms-symbollockup_signin_light.svg" alt="Login with Microsoft"></a>
				<span>Don't have a Microsoft Account?<br> Use the <a href="https://plagiatus.net/tools/realmadmin">old page</a>.</span>
			</div>
		</div>
		<div id="info">
			<h2>Info</h2>
			<p>Realms Hub is an independent web service that allows you to manage your Realm from the web.</p>
			<p>A Realm is a Minecraft Server, hosted by Mojang / Microsoft, the creators of the best-selling game ever.</p>
			<p>This service is developed and maintained by <a href="https://plagiatus.net" target="_blank" rel="noopener noreferrer">Plagiatus</a>.</p>
			<p>The website source code is open source and can be found <a href="https://github.com/Plagiatus/RealmsHub/" target="_blank" rel="noopener noreferrer">here</a>.</p>
		</div>
		<div id="faq">
			<h2>FAQ</h2>
			<collapsible :headline="'What can I do with this?'" :content="'Realms Hub lets you do basically anything you can also do with your realm ingame. Plus some additional features you won\'t find ingame!'"/>
			<collapsible :headline="'Why do I need to login with Microsoft?'" :content="'All Mojang games have recently been merged to Microsoft.\nThus you need to login with Microsoft to be able to access your game information and manage your realm.'"/>
			<collapsible :headline="'What kind of data to you save on your servers?'" :content="'We only store what is absolutely necessary for the service to work correctly, which is limited to the authentication tokens we get from the various needed Microsoft Services. As soon as you logout, all data on our servers will be deleted.'"/>
			<collapsible :headline="'I\'ve found a bug. How can I report it?'" :content="'To submit a bug, please join our discord or send an email to contact[at]plagiatus[dot]net. Please include what you were trying to do and what happened instead. If you got an error popup, a screenshot of that would be appreciated.'"/>
			<collapsible :headline="'How can I submit a feature request?'" :content="'To submit a feature request, please join our discord server or send an email to contact[at]plagiatus[dot]net. Please be aware that this is just a third party display and that we have no control over how the actual realm works!'"/>
		</div>
		<div id="discord">
			<h2>Discord</h2>
			<p>Join our <a href="https://discord.gg/upVpFQD" target="_blank" rel="noopener noreferrer">discord server</a> to get the latest updates on the website, submit bugs, request new features or just hang out with likeminded Minecraft Realms players.</p>
			<a href="https://discord.gg/upVpFQD" target="_blank" rel="noopener noreferrer">
				<img src="../assets/Discord-Logo+Wordmark-Color.svg" alt="Discord Logo">
			</a>
		</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import Collapsible from '../components/Collapsible.vue';

export default defineComponent({
	components: {
		Collapsible
	}
})
</script>

<style scoped>
	.home {
		width: 100%;
		max-width: 800px;
	}

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

	#login a,
	#login a:visited{
		color: inherit;
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
		color: #2c3e50;
	}
</style>