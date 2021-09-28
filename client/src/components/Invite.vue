<template>
	<div class="realm">
		<img class="realm-owner" :src="'https://crafatar.com/renders/head/' + invite.worldOwnerUuid + '?scale=4&overlay'" :alt="invite.worldOwnerUuid + '\'s head'">
		<formatted-text class="realm-name" :text="invite.worldName" />
		<formatted-text class="realm-motd" :text="invite.worldDescription" />
		<span class="realm-manage" @click="accept()">Accept <img class="realm-arrow" src="../assets/arrow-right.svg"></span>
		<span class="realm-leave" @click="deny()">Reject <img class="realm-arrow" src="../assets/arrow-right.svg"></span>

	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormattedText from './FormattedText.vue';
import request from "../components/request-mixin";

export default defineComponent({
	mixins: [request],
  components: { FormattedText },
	name: "Invite",
	props: ["invite"],
	methods: {
		async accept() {
			let id: string | null = localStorage.getItem("id");
			let result = await this.sendRequest("/invites/accept", "POST", {id, invitationId: this.invite.invitationId});
			if(!result) return;
			this.$emit("remove-invite", this.invite.invitationId);
		}, 
		async deny() {
			let id: string | null = localStorage.getItem("id");
			let result = await this.sendRequest("/invites/reject", "POST", {id, invitationId: this.invite.invitationId});
			if(!result) return;
			this.$emit("remove-invite", this.invite.invitationId);
		}
	}
})
</script>