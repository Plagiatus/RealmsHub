<template>
	<div class="realm">
		<img class="realm-owner" :src="'https://crafatar.com/renders/head/' + realm.ownerUUID + '?scale=4&overlay'" :alt="realm.owner + '\'s head'">
		<span class="realm-status">
			<div class="realm-status-dot" :style="{background: statusColorVariable}"></div>
			{{status}}
			- {{realm.owner}}
			</span>
		<formatted-text class="realm-name" :text="realm.name" />
		<formatted-text class="realm-motd" :text="realm.motd" />
		<router-link :to="'/world/' + this.realm.id" class="realm-manage" v-if="owner">Manage <img class="realm-arrow" src="../assets/arrow-right.svg"></router-link>
		<span class="realm-leave" v-else @click="leave()">Leave <img class="realm-arrow" src="../assets/arrow-right.svg"></span>

	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormattedText from './FormattedText.vue';

export default defineComponent({
  components: { FormattedText },
	name: "Realm",
	props: ["realm", "owner"],
	computed: {
		status(): string {
			if(this.realm.expired) return "expired";
			if(this.realm.state == "OPEN") return "open";
			return "closed";
		},
		statusColorVariable(): string {
			if(this.realm.expired) return "var(--expired)";
			if(this.realm.state == "OPEN") return "var(--highlight)";
			return "var(--red)";
		}
	},
	methods: {
		leave() {
			//
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