<template>
	<div>
		<AnnouncementBanner v-if="showAnnouncementBanner" @close="closeAnnouncementBanner" :content="announcementContent" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AnnouncementBanner from "./AnnouncementBanner.vue";
import request from "../request-mixin";

export default defineComponent({
	mixins: [request],
	components: {
		AnnouncementBanner,
	},
	data() {
		return {
			showAnnouncementBanner: false,
			announcementContent: "",
		}
	},
	methods: {
		closeAnnouncementBanner(){
			this.showAnnouncementBanner = false;
			console.log("close banner");
		},
		async checkForAnnouncementMessage(){
			let result = await this.sendRequest("/announcement", "GET");
			if(!result) return;
			this.showAnnouncementBanner = true;
			this.announcementContent = result;
		},
	},
	mounted() {
		this.checkForAnnouncementMessage();
	}
})
</script>
