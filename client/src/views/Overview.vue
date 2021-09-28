<template>
  <div class="overview">
		<div class="realms-tabs">
			<label class="realms-tab" :class="{'selected': (tab == 'realms')}" for="show-realms">All Realms</label>
			<span v-if="!loadingInvites && invites.length>0"> |
				<label class="realms-tab" :class="{'selected': (tab == 'invites')}" for="show-invites">Invites</label> <span id="realms-invites-count">{{this.invites.length}}</span>
			</span> 
		</div>
		<input type="radio" name="tabselector" id="show-realms" value="realms" v-model="tab" hidden>
		<input type="radio" name="tabselector" id="show-invites" value="invites" v-model="tab" hidden>
		<div class="joinedrealms" v-if="tab == 'realms'">
			<h2>Your realms</h2>
			<div class="realms-list" :class="{ loading: loading }">
				<realm v-for="realm in myServers" v-bind:key="realm" :realm="realm" :owner="true" />
				<p v-if="!loading && myServers.length < 1">You don't seem to own any realms.</p>
			</div>
			<h2>All realms</h2>
			<div class="realms-list" :class="{ loading: loading }">
				<realm v-for="realm in allServers" v-bind:key="realm" :realm="realm" :owner="false" @leave-realm="leaveRealm"/>
				<p v-if="!loading && allServers.length < 1">You don't seem to be invited to any realms.</p>
			</div>
		</div>
		<div class="invitedRealms" v-if="tab == 'invites'">
			<invite v-for="invite in invites" v-bind:key="invite" :invite="invite" @remove-invite="removeInvite"/>
		</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../components/request-mixin";
import Realm from "../components/Realm.vue";
import Invite from "../components/Invite.vue";

export default defineComponent({
  mixins: [request],
  components: {
    Realm,
		Invite
  },
  data() {
    return {
      loading: true,
			loadingInvites: true,
      myServers: [] as any[],
      allServers: [] as any[],
			invites: [] as any[],
			tab: "realms",
    };
  },
  async mounted() {
    this.loadRealms();
    this.loadInvites();
  },
	methods: {
		sortRealms(a: RealmI, b: RealmI): number {
			if(a.expired && !b.expired) return 1;
			if(!a.expired && b.expired) return -1;
			return 0;
		},
		async loadRealms() : Promise<void>{
			let id: string | null = localStorage.getItem("id");
			let result: string | undefined = await this.sendRequest("/worlds", "POST", { id });
			if (!result) return;
			let allServers = JSON.parse(result).servers;
			this.myServers = [] as Array<RealmI>;
			this.allServers = [] as Array<RealmI>;
			let user: string | null = localStorage.getItem("user");
			for (let server of allServers) {
				if (server.owner == user) {
					this.myServers.push(server);
				} else {
					this.allServers.push(server);
				}
			}
			this.allServers.sort(this.sortRealms);
			this.myServers.sort(this.sortRealms);
			this.loading = false;
		},
		async loadInvites(): Promise<void> {
			let id: string | null = localStorage.getItem("id");
			let result: string | undefined = await this.sendRequest("/invites/get", "POST", { id });
			if(!result) return;
			this.invites = JSON.parse(result).invites;
			this.loadingInvites = false;
		},
		removeInvite(_invId: string) {
			this.invites = this.invites.filter(i => i.invitationId != _invId);
			if(this.invites.length == 0) {
				this.tab = "realms"; 
			}
			this.loadRealms();
		},
		leaveRealm(_realmId: string) {
			this.allServers = this.allServers.filter(i => i.id != _realmId);
			this.loadRealms();
		}
	}
});

interface RealmI {
	expired: boolean;
}
</script>

<style>
.overview {
  text-align: left;
	width: 100%;
	height: 100%;
}

.realms-list {
  position: relative;
  min-height: 30px;
  display: flex;
  flex-wrap: wrap;
}

.realms-tabs {
	font-size: 1.5em;
}

.realms-tab {
	cursor: pointer;
	/* font-weight: bold; */
}
.realms-tab.selected {
	color: var(--highlight);
	border-bottom: 2px solid var(--highlight);
}
#realms-invites-count {
	background-color: var(--highlight);
	color: var(--background);
	font-size: 1em;
	width: 1.2em;
	height: 1.2em;
	display: inline-block;
	text-align: center;
	border-radius: 50%;
}
</style>