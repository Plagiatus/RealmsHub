<template>
	<div class="slot" :class="{active: active}">
		<img :src="src" alt="Minigame Image">
		<span class="slot-description">{{description}}</span>
		<span class="slot-name">{{name}}</span>
		<button class="btn" :class="{light: !active}" @click="openMinigame" disabled="disabled">{{buttontext}}</button>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "../request-mixin";


export default defineComponent({
	mixins: [request],
	props: ["active", "name", "image"],
	data() {
		return {
			loadingSlotChange: false,
		}
	},
	computed: {
		description(): string {
			let desc = "Minigame slot";
			if(this.active) {
				desc += " - selected";
			}
			return desc;
		},
		buttontext(): string {
			if(!this.active)
				return "Switch to Minigame";
			return "Change Minigame";
		},
		src(): string {
			return "data:image/jpeg;base64," + this.image;
		},
	},
	methods: {
		openMinigame() {
			this.$emit("openMinigame");
		}
	}
})
</script>

<style>
</style>