<template>
	<div id="slot-settings" class="gray-block">
		<h2>Slot Settings</h2>
		<div>
			<table>
				<tbody>
					<tr>
						<td><label for="name">Slot Name</label></td>
						<td><input id="name" type="text" v-model="setting.slotName" class="input"></td>
					</tr>
					<tr>
						<td><label for="difficult">Difficulty</label></td>
						<td>
							<select v-model="setting.difficulty" id="difficulty">
								<option value="0">Peaceful</option>
								<option value="1">Easy</option>
								<option value="2">Normal</option>
								<option value="3">Hard</option>
							</select>
						</td>
					</tr>
					<tr>
						<td><label for="gamemode">Default Gamemode</label></td>
						<td>
							<select v-model="setting.gameMode" id="difficulty">
								<option value="0">Survival</option>
								<option value="1">Creative</option>
								<option value="2">Adventure</option>
							</select>
						</td>
					</tr>
					<tr>
						<td><label for="forceGamemode">Force Default Gamemode</label></td>
						<td><input id="forceGamemode" class="toggle" type="checkbox" v-model="setting.forceGameMode"></td>
					</tr>
					<tr>
						<td><label for="spawnP">Spawn Protection Distance</label></td>
						<td><span class="valueDisplay">{{spawnProtectionText}}</span><input id="spawnP" type="range" v-model="setting.spawnProtection" min="0" max="16" step="1" class="slider"></td>
					</tr>
				</tbody>
			</table>
			<table>
				<tbody>
					<tr>
						<td><label for="pvp">PvP</label></td>
						<td><input id="pvp" class="toggle" type="checkbox" v-model="setting.pvp"></td>
					</tr>
					<tr>
						<td><label for="spawnA">Spawn Animals</label></td>
						<td><input id="spawnA" class="toggle" type="checkbox" v-model="setting.spawnAnimals"></td>
					</tr>
					<tr>
						<td><label for="spawnM">Spawn Monsters</label></td>
						<td><input id="spawnM" class="toggle" type="checkbox" v-model="setting.spawnMonsters" :disabled="setting.difficulty == 0"></td>
					</tr>
					<tr>
						<td><label for="spawnN">Spawn NPCs</label></td>
						<td><input id="spawnN" class="toggle" type="checkbox" v-model="setting.spawnNPCs"></td>
					</tr>
					<tr>
						<td><label for="commands">Enable Commandblocks</label></td>
						<td><input id="commands" class="toggle" type="checkbox" v-model="setting.commandBlocks"></td>
					</tr>
				</tbody>
			</table>
		</div>
		<loading-button :loading="loading" :text="'Update Settings'" :successText="'Settings updated'" @click="updateSettings"/>
		<span @click="close" class="close"><img src="../../assets/x.svg" alt="close"></span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SlotSettings } from "../../views/World.vue";
import request from "../request-mixin";
import LoadingButton from "../LoadingButton.vue";


export default defineComponent({
	props: ["settings", "worldId", "slotId"],
	mixins: [request],
	components: {
		LoadingButton
	},
	data() {
		return {
			loading: false,
			setting: JSON.parse(this.settings),
		}
	},
	watch: {
		settings() {
			this.setting = JSON.parse(this.settings);
		}
	},
	computed: {
		spawnProtectionText(): string {
			if(this.setting.spawnProtection == 0) return "off";
			return this.setting?.spawnProtection?.toString() + " blocks";
		},
	},
	methods: {
		async updateSettings() {
			this.loading = true;
			if(this.setting.spawnProtection < 0) this.setting.spawnProtection = 0;
			let slot = this.slotId;
			let settings = this.setting;
			let result = await this.sendRequest("/worlds/slot/settings", "POST", {worldId: this.worldId, slot, settings});
			this.loading = false;
			if(!result) return;
			this.$emit("updateSlotSettings", settings, slot);
		},
		close() {
			this.$emit("close");
		},
	},
})
</script>

<style scoped>
	#slot-settings > div {
		display: flex;
		flex-direction: row;
		position: relative;
	}

	table {
		width: 50%;
		box-sizing: border-box;
		padding: .5em;
	}

	.valueDisplay {
		display: block;
		width: 100%;
		text-align: center;
		font-size: 1em;
		font-style: italic;
		color: var(--highlight);
	}

	.slider {
		width: 100%;
	}
</style>