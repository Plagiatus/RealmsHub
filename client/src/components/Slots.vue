<template>
	<div id="slots">
		<slots v-for="slot in realm.slots" :slots="slot" :key="slot" :selectedSlot="realm.activeSlot" :worldId="worldId" :minigameActive="realm.worldType=='MINIGAME'" @select-slot="selectSlot" @open-settings="openSettings" @openResetWorld="openResetWorld" />
		<minigame-slot :name="realm.minigameName" :image="realm.minigameImage" :active="realm.worldType=='MINIGAME'" @open-minigame="openMinigame" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Slot } from '../views/World.vue';
import Slots from "./slots/Slot.vue";
import MinigameSlot from "./slots/MinigameSlot.vue";

export default defineComponent({
	components: {
		Slots,
		MinigameSlot,
	},
	props: ["realm", "worldId"],
	methods: {
		selectSlot(_slot: number) {
			this.$emit("selectSlot", _slot);
		},
		openSettings() {
			this.$emit("openSettings");
		},
		openMinigame() {
			this.$emit("openMinigame");
		},
		openResetWorld() {
			this.$emit("openResetWorld");
		},
	}
})
</script>

<style>
#slots {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}
</style>