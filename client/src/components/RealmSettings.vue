<template>
	<div id="realm-settings">
		<h2>Realm settings</h2>
		<label for="realm-name">Realm name</label>
		<input class="input" type="text" name="realmName" id="realm-name" v-model="name">
		<label for="realm-desc">Realm description</label>
		<textarea class="input"  name="realmDescription" id="realm-desc" v-model="description" rows="3" />
		<span id="colorinfo">Both of these support <a href="https://www.digminecraft.com/lists/color_list_pc.php" target="_blank" rel="noopener noreferrer">Formatting Codes</a> (the § variant).</span>
		<loading-button @click="save" :loading="loading" :text="'Save Settings'" :successText="'Saved'" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "../components/request-mixin";
import LoadingButton from "./LoadingButton.vue";

export default defineComponent({
	mixins: [request],
	components: {LoadingButton},
	props: ["realmName", "realmDescription", "worldId"],
	data() {
		return {
			name: this.realmName,
			description: this.realmDescription,
			loading: false,
		}
	},
	methods: {
		async save() {
			if(this.loading) return;
			this.loading = true;
			let result = await this.sendRequest("/worlds/settings", "POST", {settings: {name: this.name, description: this.description}, worldId: this.worldId});
			if(!result) {
				this.loading = false;
				return;
			}
			this.$emit("updateRealm");
			this.loading = false;
		}
	}
})
</script>

<style>
#realm-settings {
	padding: 2em;
	border-radius: 2rem;
	margin: 1rem;
	background-color: var(--foreground-gray);
	position: relative;
	min-width: 300px;
	border: 1px solid var(--background);
}

.input{
	padding: .375rem .75rem;
	border-radius: 0.2em;
	color: #212529;
	border: 1px solid #ced4da;
	border-radius: .25rem;
	width: calc(100% - 2rem);
	display: block;
	font: inherit;
	resize: none;
}
</style>

<style scoped>
label {
	margin-bottom: .5rem;
	margin-top: 1rem;
	display: inline-block;
}

button {
	margin-top: 1em;
	position: relative;
}

#colorinfo {
	display: block;
	font-size: .9em;
	font-style: italic;
	margin: .5em 0;
}
</style>