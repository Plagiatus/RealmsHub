<template>
	<div class="gray-block">
		<h2>Reset World</h2>
		<h3>This will replace the currently active slot with a new world.</h3>
		<div id="flex">
			<div class="reset-option">
				<button class="reset-option-title btn light" @click="openNewWorldSettings">New World</button>
			</div>
			<div class="reset-option">
				<button class="reset-option-title btn light" disabled="disabled">Upload World</button>
			</div>
			<div class="reset-option">
				<button class="reset-option-title btn light" @click="openTemplate('NORMAL')">World Template</button>
			</div>
			<div class="reset-option">
				<button class="reset-option-title btn light" @click="openTemplate('ADVENTUREMAP')">Adventure Map</button>
			</div>
			<div class="reset-option">
				<button class="reset-option-title btn light" @click="openTemplate('EXPERIENCE')">Experience Map</button>
			</div>
			<div class="reset-option">
				<button class="reset-option-title btn light" @click="openTemplate('INSPIRATION')">Inspiration Map</button>
			</div>
		</div>
		<transition name="grow">
			<div v-if="newWorldSettingsOpen" class="gray-block">
				<label for="seed">Seed</label>
				<input id="seed" type="text" v-model="newWorldSettings.seed" placeholder="optional" class="input">
				<table>
					<tbody>
						<tr>
							<td><label for="genStruct">Generate Structures</label></td>
							<td><input id="genStruct" type="checkbox" v-model="newWorldSettings.generateStructures" class="toggle"></td>
						</tr>
						<tr>
							<td><label for="worldType">World Type</label></td>
							<td>
								<select id="worldType">
									<option value="0">Default</option>
									<option value="1">Superflat</option>
									<option value="2">Large Biomes</option>
									<option value="3">Amplified</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>
				<loading-button @click="confirmNewWorld" id="confirmWorldReset" :text="'Confirm'" :loading="loading" :successText="'Success!'"/>
				<span class="§o">This will take around one minute. <span v-if="loading">({{timeElapsed}}s)</span></span>
				<span @click="closeNewWorldSettings" class="close"><img src="../../assets/x.svg" alt="close"></span>
			</div>
		</transition>

		<span @click="close" class="close"><img src="../../assets/x.svg" alt="close"></span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoadingButton from "../LoadingButton.vue";
import request from "../../components/request-mixin";
import { TemplateType } from '@/views/World.vue';

export default defineComponent({
	props: ["worldId"],
	mixins: [request],
	components: {
		LoadingButton,
	},
	data() {
		return {
			loading: false,
			timeElapsed: 0,
			newWorldSettingsOpen: false,
			newWorldSettings: {
				seed: "",
				levelType: 0,
				generateStructures: true,
			} as RealmWorldResetSettings,
		}
	},
	methods: {
		close() {
			this.$emit("close");
		},
		openNewWorldSettings(){
			this.newWorldSettingsOpen = true;
			this.$emit("closeTemplate");
		},
		closeNewWorldSettings(){
			this.newWorldSettingsOpen = false;
		},
		async confirmNewWorld() {
			this.loading = true;
			setTimeout(this.updateTime, 1000);
			let result = await this.sendRequest("/worlds/reset", "POST", {worldId: this.worldId, seed: this.newWorldSettings.seed, worldType: this.newWorldSettings.levelType, genStructures: this.newWorldSettings.generateStructures});
			this.loading = false;
			if(!result) return;
		},
		updateTime(){
			if(!this.loading) return;
			this.timeElapsed++;
			setTimeout(this.updateTime, 1000);
		},
		openTemplate(_type: TemplateType){
			this.newWorldSettingsOpen = false;
			this.$emit("openTemplate", _type)
		},
	}
});

interface RealmWorldResetSettings {
	seed: string,
	worldTemplateId: number,
	levelType: LevelType,
	generateStructures: boolean
}


interface UploadInfo {
	worldClosed: boolean,
	token: string,
	uploadEndpoint: string,
	port: number
}

type LevelType = 0 | 1 | 2 | 3 | -1;

</script>

<style scoped>
#flex {
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
}

label {
	display: inline-block;
	margin: .5em 0;
}

#confirmWorldReset {
	margin-top: 1em;
	margin-right: 1em;
}
select {
	margin-left: 10px;
}
</style>