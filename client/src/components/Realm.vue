<template>
	<div class="realm">
		<div class="realm-owner-wrapper">
			<img class="realm-owner" :src="'https://crafatar.com/renders/head/' + realm.ownerUUID + '?scale=4&overlay'" :alt="realm.owner + '\'s head'">
			<span class="realm-status">
				<div class="realm-status-dot" :style="{background: statusColorVariable}"></div>
				{{status}}
				- {{realm.owner}}
				</span>
		</div>
		<div class="realm-info-wrapper">
			<formatted-text class="realm-name" :text="realm.name" />
			<span class="realm-motd">
				<span class="realm-minigame" v-if="realm.minigameName">Minigame</span>
				<formatted-text  :text="motd" />
			</span>
			<router-link :to="'/world/' + this.realm.id" class="realm-manage" v-if="owner">Manage <img class="realm-arrow" src="../assets/arrow-right.svg"></router-link>
			<span class="realm-leave" v-else @click="leave()">Leave <img class="realm-arrow" src="../assets/arrow-right.svg"></span>
		</div>

	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormattedText from './FormattedText.vue';
import request from "../components/request-mixin";

export default defineComponent({
	mixins:[request],
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
		},
		motd(): string {
			if(this.realm.minigameName) {
				return this.realm.minigameName;
			}
			return this.realm.motd;
		},
	},
	methods: {
		leave() {
			let id = localStorage.getItem("id");
			let worldId = this.realm.id;
			let result = this.sendRequest("/worlds/leave", "POST", {id, worldId})
			if(!result) return;
			this.$emit("leave-realm", worldId);
		}
	}
})
</script>

<style>
.realm {
	text-align: left;
	width: 300px;
	height: 200px;
	border: 1px solid transparent;
	border-bottom-color: var(--highlight);
	border-right-color: var(--highlight);
	border-bottom-right-radius: 1em;
	margin: 1em;
	padding: 1em;
	box-shadow: 0.6em 0.6em 1em rgba(0, 0, 0, 0.1);
}

body.dark .realm {
	box-shadow: 0.6em 0.6em 1em rgba(255, 255, 255, 0.05);
}

.realm > div > span {
	display: block;
	margin: 0.5em 0;
	white-space: nowrap;
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

.realm-minigame {
	background-color: var(--gold);
	color: var(--foreground);
	padding: .25rem;
	border-radius: .25rem;
	margin-right: .4em;
}


@media screen and (max-width: 920px) {
	.realm {
		width: 95%;
		height: 100px;
		display: flex;
	}

	.realm-info-wrapper {
		display: flex;
		flex-direction: column;
		margin-left: 1em;
	}
	.realm-owner-wrapper {
		width: 150px;
	}
}

@media screen and (max-width: 550px) {
	span.realm-name {
		font-size: 1em;
	}
	
	.realm-owner-wrapper {
		width: 100px;
	}

	.realm-status {
		font-size: 0.6em;
	}
	
	.realm {
		margin: .2em;
		padding: .2em;
	}
}

</style>