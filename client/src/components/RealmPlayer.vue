<template>
	<div class="realm-player">
		<div class="realm-player-status-dot" :style="{background: statusColorVariable}"></div>
		<span class="realm-player-name">{{player.name}}</span>
		<button @click="remove()" :class="{loading: loadingRemove}" class="realm-player-button realm-player-remove keep-dark" :disabled="loadingRemove"><img src="../assets/x.svg" alt="Remove"></button>
		<button @click="toggleOP()" :class="{loading: loadingOP}" class="realm-player-button realm-player-op" :disabled="loadingOP"><img :src="player.operator ? require('../assets/star.svg'):require('../assets/star-empty.svg')" alt="Toggle OP"></button>
		<span class="realm-player-status keep-dark">{{statusText}}</span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "../components/request-mixin";

export default defineComponent({
	mixins: [request],
	props: ["player", "worldId"],
	data() {
		return {
			loadingOP: false,
			loadingRemove: false,
		}
	},
	methods: {
		async remove() {
			this.loadingRemove = true;
			let result = await this.sendRequest("/worlds/player/kick", "POST", {worldId: this.worldId, uuid: this.player.uuid});
			this.loadingRemove = false;
			if(!result) return;
			this.$emit("removePlayer", this.player.uuid);
		},
		async toggleOP(){
			this.loadingOP = true;
			let op = "op";
			if(this.player.operator) {
				op = "deop";
			}
			let result = await this.sendRequest("/worlds/player/" + op, "POST", {worldId: this.worldId, uuid: this.player.uuid});
			this.loadingOP = false;
			if(!result) return;
			this.$emit("update-ops", JSON.parse(result));
		}
	},
	computed: {
		statusText(): string {
			if(!this.player.accepted) return "Invited";
			if(this.player.online) return "Online";
			return "Offline";
		},
		star(): string {
			if(this.player.operator) return "../assets/star.svg";
			return "../assets/star-empty.svg";
		},
		statusColorVariable(): string {
			if(!this.player.accepted) return "var(--gold)";
			if(this.player.online) return "var(--highlight)";
			return "var(--red)";
		},
	}
})

// interface RealmsPlayer {
// 	uuid: string,
// 	name: string,
// 	operator: boolean,
// 	accepted: boolean,
// 	online: boolean,
// 	permission: "MEMBER" | "OPERATOR",
// }
</script>

<style>

.realm-player {
	height: 2em;
}

.realm-player-button {
	float:right;
	margin: 0 .3em;
	padding: 0;
	background-color: var(--btn-slight-red);
	border-radius: 0.2em;
	border: none;
	cursor: pointer;
	height: 1.6em;
	width: 1.6em;
	padding: .3em;
	font-size: 1em;
	position: relative;
}

.realm-player-status-dot {
	width: 0.6em;
	height: 0.6em;
	border-radius: 50%;
	display: inline-block;
	margin-right: .5em;
}
.realm-player-status {
	font-size: .8em;
	margin-left: .5em;
	background-color: var(--btn-slight-red);
	padding: .3em .5em;
	border-radius: .2em;
	float: right;
	color: var(--font-color);
}

.realm-player-button img {
	width: 1em;
	height: 1em;
	filter: var(--font-color-filter);
}

.realm-player-op img {
	filter: var(--gold-filter);
}

.realm-player-button:disabled {
	/* cursor: not-allowed; */
	cursor: default;

}
.realm-player-button:disabled img {
	filter: invert(99%) sepia(0%) saturate(1101%) hue-rotate(177deg) brightness(119%) contrast(87%);
}
body.dark .realm-player-button:disabled img {
	filter: var(--foreground-filter);
}
.realm-player-button.loading:before {
	width: 1em;
  height: 1em;
  margin-top: -.5em;
  margin-left: -.5em;
}

.realm-player-op {
	background-color: transparent;
}
</style>