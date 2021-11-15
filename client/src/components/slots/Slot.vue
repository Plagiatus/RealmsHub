<template>
	<div class="slot" :class="{active: selected}">
		<img :src="imgsource" alt="">
		<div class="slot-inner-wrapper">
			<span class="slot-description">{{description}}</span>
			<formatted-text class="slot-name" :text="name" />
			<div class="slot-inner-button-wrapper">
				<loading-button v-if="!this.selected" class="btn light" @click="selectSlot" :text="'Select Slot'" :successText="''" :loading="this.loadingSlotChange"/>
				<button v-if="this.selected" class="btn light" @click="openSettings">Settings</button>
				<button v-if="this.selected" class="btn" @click="openResetWorld">Reset World</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SlotSettings } from '../../views/World.vue';
import LoadingButton from "../LoadingButton.vue";
import FormattedText from '../FormattedText.vue';
import request from "../request-mixin";


export default defineComponent({
	mixins: [request],
	props: ["slots", "selectedSlot", "worldId", "minigameActive"],
	components: {LoadingButton, FormattedText},
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
		imgsource(): string {
			if(this.options.worldTemplateImage) {
				return "data:image/jpeg;base64," + this.options.worldTemplateImage;
			}
			let image = require.context("../../assets/");
			return image("./logo.png");
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
.slot,
.slot-inner-wrapper,
.slot-inner-button-wrapper {
	display: flex;
	flex-direction: column;
	text-align: center;
}

.slot {
	padding: .5rem;
	border-radius: .25rem;
	outline: 1px solid #aaa;
	margin: .1em;
}

.slot.active {
	outline: 3px solid var(--highlight);
}

.slot > img {
	width: 160px;
	height: 160px;
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

.slot-inner-button-wrapper button {
	margin-top: 0.5em;
}

@media screen and (max-width: 1056px) {
	.slot {
		width: calc(50% - 0.5em);
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		margin: .25em;
	}
	.slot-inner-wrapper {
		flex-grow: 1;
		padding-left: .5em;
	}
	.slot > img {
		width: 80px;
		height: 80px;
	}
	.slot-inner-button-wrapper button {
		margin: 0.5em;
	}
}

@media screen and (max-width: 660px) {
	.slot {
		width: calc(100% - .5em);
		align-items: center;
	}
}
</style>