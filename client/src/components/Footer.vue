<template>
	<div id="footer">
		<div id="footer-attribution">
			<span>Created by <a href="https://plagiatus.net" target="_blank" rel="noopener noreferrer">Plagiatus</a></span>
			<span>Design by <a href="https://twitter.com/TWmrjvs" target="_blank" rel="noopener noreferrer">MrJVS</a></span>
			<span>Minecraft Avatars provided by <a href="https://crafatar.com/" target="_blank" rel="noopener noreferrer">Crafatar</a></span>
		</div>
		<div id="footer-copyright" class="italic">
			<span>&copy; Realmshub.com 2020-2021</span>
		</div>
		<div id="footer-settings">
			<div id="footer-settings-inner" @click="toggleSettings">
				<span>Settings</span>
				<img src="../assets/cog.svg" alt="settings" id="settings-img" :class="{rotated: settingsVisible}">
			</div>
			<transition name="fade">
				<settings v-if="settingsVisible" />
			</transition>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Settings from "./Settings.vue";

export default defineComponent({
	components: {
		Settings
	},
	data(){
		return {
			settingsVisible: false
		}
	},
	methods: {
		toggleSettings(){
			this.settingsVisible = !this.settingsVisible;
		}
	}
})
</script>


<style>
#footer {
	display: flex;
	justify-content: space-around;
	width: 100%;
	max-width: 800px;
	margin-top: 2em;
}
#footer > div {
	flex: 1 1 0;
	width: 0;
	display: flex;
}

#settings-img {
	transition: transform .5s;
	width: 2em;
	margin-left: 1em;
	filter: var(--font-color-filter);
}
#settings-img.rotated {
	transform: rotate(90deg);
}
#footer-settings{
	align-items: center;
	justify-content: right;
	position: relative;
}
#footer-settings-inner{
	cursor: pointer;
  user-select: none;
	display: flex;
	align-items: center;
	justify-content: right;
	position: relative;
	padding: .2em;
}
#footer-attribution {
	flex-direction: column;
	align-items: flex-start;
	text-align: left;
	font-size: .8em;
}
#footer-copyright {
	align-items: flex-end;
	justify-content: center;
	font-size: .8em;
}
</style>