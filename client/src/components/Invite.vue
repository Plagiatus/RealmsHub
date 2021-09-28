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
			let result = this.sendRequest("/invites/accept", "POST", {id, invitationId: this.invite.invitationId});
			if(!result) return;
			this.$emit("remove-invite", this.invite.invitationId);
		}, 
		async deny() {
			let id: string | null = localStorage.getItem("id");
			let result = this.sendRequest("/invites/reject", "POST", {id, invitationId: this.invite.invitationId});
			if(!result) return;
			this.$emit("remove-invite", this.invite.invitationId);
		}
	}
})
</script>

<style>
.realm {
	text-align: left;
	width: 300px;
	height: 200px;
	padding: 0.2em;
	border: 1px solid transparent;
	border-bottom-color: var(--highlight);
	border-right-color: var(--highlight);
	border-radius: 1em;
	margin: 1em;
	padding: 1em;
}

.realm span {
	display: block;
	margin: 0.5em 0;
}

.realm-status-dot {
	width: 0.6em;
	height: 0.6em;
	border-radius: 50%;
	display: inline-block;
}

.realm-status {
	color: #888;
	font-size: 0.8em;
}

span.realm-name {
	font-size: 1.2em;
	margin-bottom: 0.7em;
}

.realm-motd {
	color: #888;
	font-size: 0.9em;
}

.realm-manage {
	color: var(--highlight);
	filter: var(--highlight-filter);
	font-weight: 600;
	cursor: pointer;
}

.realm-leave {
	color: var(--red);
	filter: var(--red-filter);
	font-weight: 600;
	cursor: pointer;
}

.realm-arrow {
	height: 0.9em;
}
</style>