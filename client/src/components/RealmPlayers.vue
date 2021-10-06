<template>
	<div id="realm-players" class="gray-block">
		<div>
			<h2>Players</h2>
			<input type="text" v-model="filter" class="input" placeholder="🔎 filter" @input="updateFilter">
			<div class="scroll-container">
				<realm-player v-for="player in acceptedPlayers" v-bind:key="player" :player="player" :worldId="worldId" @remove-player="removePlayer" @update-ops="updateOPs"/>
			</div> 
		</div>
		<div>
			<h3>Invite</h3>
			<input type="text" class="input" v-model="playername" placeholder="Playername">
			<loading-button :disabled="!playername" @click="invite" :text="'Invite'" :successText="'Invited'" :loading="loading"/>
			<h3 v-if="notAcceptedPlayers.length > 0">Invited</h3>
			<div class="scroll-container"> 
				<realm-player v-for="player in notAcceptedPlayers" v-bind:key="player" :player="player" :worldId="worldId" @remove-player="removePlayer" @update-ops="updateOPs"/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "../components/request-mixin";
import { Ops } from '../views/World.vue';
import LoadingButton from './LoadingButton.vue';
import RealmPlayer from './RealmPlayer.vue';

export default defineComponent({
	mixins: [request],
	props: ["players", "worldId"],
	components: {
		RealmPlayer,
		LoadingButton
	},
	data() {
		return {
			loading: false,
			inviteOpen: false,
			filter: "",
			playername: "",
		}
	},
	methods: {
		async updateRealm() {
			this.$emit("updateRealm");
		},
		sortPlayers(a: RealmsPlayer, b: RealmsPlayer): number {
			if(a.operator && !b.operator) return -1;
			if(!a.operator && b.operator) return 1;
			if(a.online && !b.online) return -1;
			if(!a.online && b.online) return 1;
			if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
			if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
			return 0;
		},
		removePlayer(uuid: string) {
			this.$emit("removePlayer", uuid);
		},
		updateOPs(newOPs: Ops) {
			this.$emit("update-ops", newOPs);
		},
		async invite(){
			this.loading = true;
			console.log({worldId: this.worldId, uuid: "1", name: this.playername})
			let result = await this.sendRequest("/worlds/player/invite", "POST", {worldId: this.worldId, uuid: "1", name: this.playername}, "Could not invite player. Are you sure you spelled the name correctly?");
			this.loading = false;
			if(!result) return;
			this.$emit("updateRealm", JSON.parse(result));
		},
		// updateFilter(){
		// 	console.log(this.filter);
		// }
	},
	computed: {
		acceptedPlayers(): RealmsPlayer[] {
			let acceptedPlayers: RealmsPlayer[] = [];

			for(let p of this.players){
				if(p.accepted) acceptedPlayers.push(p);
			}
			acceptedPlayers = acceptedPlayers.filter(p => p.name.toLowerCase().includes(this.filter.toLowerCase()))
			acceptedPlayers.sort(this.sortPlayers)
			return acceptedPlayers;
		},
		notAcceptedPlayers(): RealmsPlayer[] {
			let notAcceptedPlayers: RealmsPlayer[] = [];

			for(let p of this.players){
				if(!p.accepted) notAcceptedPlayers.push(p);
			}
			notAcceptedPlayers.sort(this.sortPlayers)
			return notAcceptedPlayers;
		}
	}
})

interface RealmsPlayer {
	uuid: string,
	name: string,
	operator: boolean,
	accepted: boolean,
	online: boolean,
	permission: "MEMBER" | "OPERATOR",
}
</script>

<style>

#realm-players {
	height: 500px;
	width: calc(100% - 2rem);
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	box-sizing: border-box;
}

#realm-players>* {
	flex-grow: 1;
	margin: 0 1em;
}

.scroll-container {
	overflow-y: auto;
	max-height: 80%;
}

h2 {
	margin-top: .5em;
}

</style>

<style scoped>
input {
	margin-bottom: 1em;
}
</style>