<template>
	<div id="realm-settings" class="gray-block">
		<h2>Realm settings</h2>
		<label for="realm-name">Realm name</label>
		<input class="input" type="text" name="realmName" id="realm-name" v-model="name">
		<span class="preview" v-if="name.includes('§')">
			<formatted-text class="block" :text="name" />
			<span class="right">Preview</span>
		</span>
		<label for="realm-desc">Realm description</label>
		<textarea class="input"  name="realmDescription" id="realm-desc" v-model="description" rows="3" />
		<span class="preview" v-if="description.includes('§')">
			<formatted-text class="block" :text="description" />
			<span class="right">Preview</span>
		</span>
		<span id="colorinfo">Both of these support <a href="https://www.digminecraft.com/lists/color_list_pc.php" target="_blank" rel="noopener noreferrer">Formatting Codes</a> (the § variant).</span>
		<loading-button @click="save" :loading="loading" :text="'Save Settings'" :successText="'Saved'" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "../components/request-mixin";
import LoadingButton from "./LoadingButton.vue";
import FormattedText from "./FormattedText.vue";

export default defineComponent({
	mixins: [request],
	components: {
		LoadingButton,
		FormattedText,	
	},
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
			this.loading = false;
			if(!result) {
				return;
			}
			this.$emit("updateRealm");
		}
	}
})
</script>

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
	font-size: .9em;
	font-style: italic;
}

.preview,
#colorinfo {
	display: block;
	margin: .5em 0;
}

.preview {
	border-radius: .5em;
	border: 1px solid var(--btn-disabled);
	padding: .5em;
	background-color: var(--foreground);
}

.right {
	float: right;
	font-style: italic;
}
</style>