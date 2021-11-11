<template>
	<div id="realm-players-wrapper" class="gray-block">
		<div id="realm-players">
			<div id="realm-players-inner">
				<h2>Players</h2>
				<input type="text" v-model="filter" class="input search" placeholder="filter">
				<div class="scroll-container" id="scroll-players">
					<realm-player v-for="player in acceptedPlayers" v-bind:key="player" :player="player" :worldId="worldId" @remove-player="removePlayer" @update-ops="updateOPs"/>
				</div> 
			</div>
			<div id="realms-players-invites">
				<h3>Invite</h3>
				<input type="text" class="input" v-model="playername" placeholder="Playername">
				<loading-button :disabled="!playername" @click="invite" :text="'Invite'" :successText="'Invited'" :loading="loading"/>
				<h3 v-if="notAcceptedPlayers.length > 0">Invited</h3>
				<div class="scroll-container" id="scroll-invites"> 
					<realm-player v-for="player in notAcceptedPlayers" v-bind:key="player" :player="player" :worldId="worldId" @remove-player="removePlayer" @update-ops="updateOPs"/>
				</div>
			</div>
		</div>
		<div id="realm-players-bulk-wrapper">
			<transition name="grow">
				<div id="realm-players-bulk" v-if="bulkOpen">
					<div class="realm-players-bulk-option">
						<h3>Export</h3>
						<div id="bulk-export-options">
							<label style="grid-area:label;" for="bulk-export-include-ops">Include OP status</label>
							<input style="grid-area:toggle" type="checkbox" name="bulk-export-include-ops" id="bulk-export-include-ops" class="toggle" v-model="includeOPInExport">
							<button style="grid-area:export" class="btn" @click="bulkExport">Export</button>
							<loading-button style="grid-area:copy" @click="copyBulkExport" :light="true" :loading="copyBulkExportLoading" :text="'Copy'" :successText="'Copied!'"/>
						</div>
						<textarea class="input" id="realm-players-bulk-export" v-model="bulkExportValue" readonly ref="exportTextarea"/>
					</div>
					<div class="realm-players-bulk-option">
						<label for="realm-players-bulk-invite"><h3>(Un)invite</h3></label>
						<span class="" style="font-size:.75em; margin-left: 1em;">Accepts <code style="font-size: 1.3em;">:op</code> tag</span>
						<div id="realm-players-bulk-invite-buttons">
							<loading-button :disabled="loadingBulkUninvite" :loading="loadingBulkInvite" :text="'Invite All'" :successText="'Invited all'" @click="bulkInvite"/>
							<loading-button :disabled="loadingBulkInvite" :loading="loadingBulkUninvite" :text="'Uninvite All'" :successText="'Uninvited all'" @click="bulkUninvite"/>
							<button class="btn light" @click="clearInviteInput" style="grid-area:clear">Clear</button>
						</div>
						<textarea class="input" id="realm-players-bulk-invite" v-model="bulkInviteValue" />
						<div id="bulk-formatting-help-wrapper">
							<div id="bulk-formatting-help">
								<span>formatting info</span>
								<img src="../assets/question-circle.svg" alt="?">
							</div>
							<div id="bulk-formatting-help-popover">
								<span>Seperate players by newlines.</span><br>
								<span>Add <code>:op</code> to mark as operator.</span><br>
								<span>For example</span>
								<pre>{{exampleFormatting}}</pre>
							</div>
						</div>
					</div>
				</div>
			</transition>
			<button class="btn light" @click="toggleBulkVisible" :class="{red: bulkOpen}" id="show-bulk-options-button">{{bulkButtonText}}</button>
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
			bulkOpen: true,
			loadingBulkInvite: false,
			loadingBulkUninvite: false,
			includeOPInExport: false,
			bulkExportValue: "",
			bulkInviteValue: "",
			copyBulkExportLoading: false,
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
		toggleBulkVisible() {
			this.bulkOpen = !this.bulkOpen;
		},
		bulkExport() {
			let exportedText = "";
			for(let player of this.players) {
				exportedText += player.name;
				if(player.operator && this.includeOPInExport) {
					exportedText += ":op";
				}
				exportedText += "\n";
			}
			this.bulkExportValue = exportedText;
		},
		copyBulkExport() {
			this.copyBulkExportLoading = true;
			let textarea = this.$refs.exportTextarea as HTMLTextAreaElement;
			textarea.focus();
			textarea.select();
			document.execCommand("copy");
			setTimeout(()=>{this.copyBulkExportLoading = false;},0);
		},
		async bulkInvite(){
			this.loadingBulkInvite = true;
			let errors: string[] = [];
			let [playersToInvite, playersToOP] = this.parseBulkInputs(this.bulkInviteValue, errors, true)

			let requests: Promise<any>[] = [];
			let endresult = "";
			for(let i = 0; i < playersToInvite.length; i++){
				if(this.players.find((p: RealmsPlayer) => p.name == playersToInvite[i])){
					continue;
				}
				let request = this.sendRequest("/worlds/player/invite", "POST", {worldId: this.worldId, uuid: "1", name: playersToInvite[i]}, `Couldn't invite player "${playersToInvite[i]}"`);
				requests.push(request);
				request.then((result)=>{
					if(!result) {
						errors.push("Couldn't invite player " + playersToInvite[i]);
						playersToInvite[i] = "";
					} else {
						endresult = result;
					}
				});
			}
			await Promise.all(requests);

			let newPlayers: RealmsPlayer[] = this.players;
			if(endresult){
				newPlayers = JSON.parse(endresult).players;
			}

			requests = [];
			for(let player of playersToOP) {
				let playerObj = newPlayers.find(p => p.name == player);
				if(!playerObj) {
					errors.push("Couldn't OP player " + player);
					continue;
				}
				let request = this.sendRequest("/worlds/player/op", "POST", {worldId: this.worldId, uuid: playerObj.uuid}, `Couldn't OP player "${player}"`);
				requests.push(request);
				request.then(result => {
					if(!result) {
						playersToOP[playersToOP.indexOf(player)] = "";
					}
				});
			}

			await Promise.all(requests);
			this.displayErrors(errors);
			
			this.$emit("updateRealm");
			this.loadingBulkInvite = false;
		},
		async bulkUninvite(){
			this.loadingBulkUninvite = true;
			let errors: string[] = [];
			let [playersToUninvite, playersToOP] = this.parseBulkInputs(this.bulkInviteValue, errors);

			let requests: Promise<string | undefined>[] = [];
			for(let player of playersToUninvite){
				let playerObj = this.players.find((p: RealmsPlayer) => p.name == player);
				if(!playerObj) {
					continue;
				}
				let request = this.sendRequest("/worlds/player/kick", "POST", {worldId: this.worldId, uuid: playerObj.uuid}, `Couldn't uninvite player "${player}"`);
				requests.push(request);
				request.then(result => {
					if(!result) {
						errors.push(`Couldn't uninvite player "${player}"`);
					}
				});
			}

			await Promise.all(requests);
			this.displayErrors(errors);
			this.$emit("updateRealm");
			this.loadingBulkUninvite = false;
		},
		parseBulkInputs(_input: string, errors: string[], withOp = false): [string[], string[]] {
			let inputs: string[] = _input.split("\n");
			let playersToInvite: string[] = [];
			let playersToOP: string[] = [];
			for(let input of inputs){
				let splitInput: string[] = input.split(":");
				let player: string = splitInput[0].trim();
				if(player.length == 0) continue;
				let disallowedCharacters = player.match(/[^a-zA-Z0-9_]/g);
				if(disallowedCharacters) {
					errors.push(`Invalid playername: "${player}"`);
					continue;
				}
				playersToInvite.push(player);
				if(splitInput.length == 2){
					if(splitInput[1] === "op" && withOp){
						playersToOP.push(player);
					} else {
						errors.push("Unknown option in " + input);
					}
				}
				if(splitInput.length > 2){
					errors.push("Too many options in " + input);
				}
			}
			return [playersToInvite, playersToOP];
		},
		displayErrors(errors: string[]) {
			if(errors.length > 0) {
				window.dispatchEvent(new CustomEvent("displayError", {
					detail: {
						code: -1,
						message: errors.join("\n"),
					}
				}));
			}
		},
		clearInviteInput() {
			this.bulkInviteValue = "";
		},
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
		},
		bulkButtonText(): string {
			if(this.bulkOpen) {
				return "Hide bulk options";
			}
			return "Show bulk options";
		},
		exampleFormatting(): string {
			return "Player1\nPlayer2:op\nPlayer3";
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
	/* width: calc(100% - 2rem); */
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	box-sizing: border-box;
}

#realm-players>* {
	flex-grow: 1;
	margin: 0 1em;
	max-height: 500px;
}

.scroll-container {
	overflow-y: auto;
}

#scroll-players {
	max-height: calc(500px - 8em);
}
#scroll-invites {
	max-height: calc(500px - 13em);
}

h2 {
	margin-top: .5em;
}

.input.search {
	background-image: url("../assets/search.svg");
	background-repeat: no-repeat;
	background-size: 1em;
	background-position: .5em .5em;
	text-indent: 1em;
}

.realm-players-bulk-option {
	margin-top: 1em;
}

#realm-players-bulk-wrapper textarea {
	margin-bottom: 1em;
	height: 8em;
}

#show-bulk-options-button {
	margin-top: 1em;
}

#realm-players-bulk {
	display: flex;
}

.realm-players-bulk-option {
	flex-grow: 1;
	width: 1%;
	margin: 1em;
}

.realm-players-bulk-option h3 {
	display: inline-block;
	margin: 0 0;
}

#bulk-export-options {
	display: grid;
	grid-template-areas: 
	"label toggle . export copy";
	grid-template-columns: auto auto 1fr auto auto;
}

.realm-players-bulk-option button:not(:first-of-type) {
	margin-left: 1em;
}

#realm-players-bulk-invite-buttons {
	display: grid;
	grid-template-areas: "invite uninvite . clear";
	grid-template-columns: auto auto 1fr auto;
}

#bulk-export-options,
#realm-players-bulk-invite-buttons {
	margin-right: 6px;
	height: 3.4em;
}


#bulk-export-options > *,
#realm-players-bulk-invite-buttons > * {
	align-self: center;
}

#bulk-formatting-help-wrapper {
	display: flex;
	justify-content: right;
	position: relative;
}

#bulk-formatting-help {
	display: flex;
	align-items: center;
	user-select: none;
}

#bulk-formatting-help > img {
	width: 1.5em;
	height: 1.5em;
	margin-left: 0.2em;
	filter: var(--font-color-filter);
}

#bulk-formatting-help-popover {
	visibility: hidden;
	position: absolute;
	bottom: 100%;
	padding: 1em;
	margin-bottom: .2em;
	background-color: var(--foreground-gray);
	border-radius: 0.35em;
	border: 1px solid #ced4da;
}

#bulk-formatting-help:hover + #bulk-formatting-help-popover,
#bulk-formatting-help-popover:hover {
	visibility: visible;
}

@media screen and (max-width: 1056px) {
	#realm-players {
		flex-direction: column;
		height: initial;
	}
	#realm-players > * {
		margin: 0;
	}
	#realm-players-inner {
		position: relative;
	}
	.scroll-container {
		max-height: 400px;
	}
	#realms-players-invites {
		margin-top: 1em;
	}
	#realm-players-bulk {
		flex-direction: column;
	}
	.realm-players-bulk-option {
		flex-grow: 1;
		width: initial;
	}
}

@media screen and (max-width: 540px) {
	#bulk-export-options {
		grid-template-areas: 
		"label toggle ."
		". export copy";
		grid-template-columns: auto auto auto;
		height: initial;
	}
	#realm-players-bulk-invite-buttons > button:not(:first-of-type) {
		margin-left: 4px;
	}
}
</style>

<style scoped>
input {
	margin-bottom: 1em;
}
</style>