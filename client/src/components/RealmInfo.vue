<template>
	<div id="realm-info" class="gray-block">
		<img class="realm-owner" :src="'https://crafatar.com/renders/head/' + realm.ownerUUID + '?scale=4&overlay'" :alt="realm.owner + '\'s head'">
		<div style="overflow: hidden;">
			<span class="realm-status">
			<div class="realm-status-dot" :style="{background: statusColorVariable}"></div>
			{{status}}
			- {{realm.owner}}
			</span>
			<formatted-text class="realm-name" :text="realm.name" />
			<formatted-text class="realm-motd" :text="realm.motd" />
			<loading-button :red="realm.state == 'OPEN'" :text="buttonText" :successText="buttonTextSuccess" :loading="loading" :disabled="realm.expired" @click="toggleOpen" />
			<button class="btn light" @click="openSettings">Settings</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import request from "../components/request-mixin";
import FormattedText from './FormattedText.vue';
import LoadingButton from './LoadingButton.vue';

export default defineComponent({
	mixins: [request],
	components: {
		FormattedText,
		LoadingButton
	},
	props: ["realm", "worldId"],
	data() {
		return {
			loading: false
		}
	},
	computed: {
		buttonText() {
			if(this.realm.state != "OPEN") return "Open realm";
			return "Close realm"
		},
		buttonTextSuccess() {
			if(this.realm.state != "OPEN") return "Closed realm";
			return "Opened realm"
		},
		status(): string {
			if(this.realm.expired) return "expired";
			if(this.realm.state == "OPEN") return "open";
			return "closed";
		},
		statusColorVariable(): string {
			if(this.realm.expired) return "var(--expired)";
			if(this.realm.state == "OPEN") return "var(--highlight)";
			return "var(--red)";
		}
	},
	methods: {
		async toggleOpen() {
			this.loading = true;
			let goal = this.realm.state == "OPEN" ? "close" : "open"; 
			let result = await this.sendRequest("/worlds/" + goal, "POST", {worldId: this.worldId}, "Failed to change open/closed status of the realm. Please try again.");
			this.loading = false;
			if(!result) return;
			this.$emit("toggleOpen");
		},
		openSettings(){
			this.$emit("openRealmSettings");
		},
	}
})
</script>

<style>
#realm-info {
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
}

#realm-info > div > span {
	display: block;
	margin: 0.5em 0;
}

#realm-info > div > button {
	display: block;
	margin: 0.5em 0;
}
</style>