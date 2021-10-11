<template>
	<div class="slot" :class="{active: selected}">
		<img src="../../assets/logo.png" alt="">
		<span class="slot-description">{{description}}</span>
		<span class="slot-name">{{name}}</span>
		<loading-button v-if="!this.selected" class="btn light" @click="selectSlot" :text="'Select Slot'" :successText="''" :loading="this.loadingSlotChange"/>
		<button v-if="this.selected" class="btn light" @click="openSettings" disabled="disabled">Settings</button>
		<button v-if="this.selected" class="btn" @click="openResetWorld" disabled="disabled">Reset World</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SlotSettings } from '../../views/World.vue';
import LoadingButton from "../LoadingButton.vue";
import request from "../request-mixin";


export default defineComponent({
	mixins: [request],
	props: ["slots", "selectedSlot", "worldId", "minigameActive"],
	components: {LoadingButton},
	data() {
		return {
			loadingSlotChange: false,
		}
	},
	computed: {
		options(): SlotSettings {
			if(this.slot && this.slot.options) {
				return JSON.parse(this.slot.options);
			}
			return {};
		},
		slot() {
			return this.slots;
		},
		selected(): boolean {
			return this.selectedSlot == this.slot.slotId && !this.minigameActive;
		},
		description(): string {
			let desc = "Not initialized";
			if(this.slot && this.slot.slotId){
				if(this.slot.slotId >= 1 && this.slot.slotId <= 3) {
					desc = "World slot";
				} else if(this.slot.slotId == 4) {
					desc = "Minigame slot"
				}
				if(this.selected) {
					desc += " - selected";
				}
			}
			return desc;
		},
		name(): string {
			if(this.options.slotName) return this.options.slotName;
			return "World " + this.slot.slotId;
		},
	},
	methods: {
		async selectSlot() {
			this.loadingSlotChange = true;
			let result = await this.sendRequest("/worlds/slot/set", "POST", {worldId: this.worldId, slot: this.slot.slotId});
			this.loadingSlotChange = false;
			if(!result) return;
			this.$emit("selectSlot", this.slot.slotId);
		},
		openSettings() {
			this.$emit("openSettings");
		},
		openResetWorld() {
			this.$emit("openResetWorld");
		}
	}
})
</script>

<style>
.slot {
	display: flex;
	flex-direction: column;
	border-radius: .25rem;
	padding: .5rem;
	outline: 1px solid #aaa;
	text-align: center;
}

.slot.active {
	outline: 3px solid var(--highlight);
}

.slot > img {
	width: 195px;
	height: 195px;
}

.slot-description {
	font-size: .75em;
	color: var(--highlight);
	margin: .5em 0;
	font-weight: bold;
}

.slot-name {
	margin: .4em 0;
	font-weight: bolder;
}

.slot > button {
	margin-top: 0.5em;
}
</style>