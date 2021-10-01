<template>
  <div class="world">
    <div v-if="!this.realm" class="loading"></div>
    <div class="world-content" v-if="!!this.realm">
      <realm-settings :realmName="realm.name" :realmDescription="realm.motd" :worldId="worldId" />
			<realm-players :players="realm.players" :worldId="worldId" @remove-player="removePlayer" @update-realm="reloadRealm" @update-ops="updateOPs"/>
    </div>
    <p><em>More features are being worked on and coming soon!</em></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "../components/request-mixin";
import RealmSettings from "../components/RealmSettings.vue";
import RealmPlayers from "../components/RealmPlayers.vue";

export default defineComponent({
  mixins: [request],
  components: {
    RealmSettings,
		RealmPlayers
  },
  props: {
    worldId: String
  },
  data() {
    return {
      realm: null as unknown as Realm,
      reloadingRealm: false
    }
  },
  async mounted() {
    this.reloadRealm();
  },
  methods: {
    async reloadRealm(_realm?: Realm) {
			console.log("reload", _realm);
      if (this.reloadingRealm) return;
			if (_realm){
				this.realm = _realm;
				return;
			}
      this.reloadingRealm = true;
      let id = localStorage.getItem("id");
      let result = await this.sendRequest("/worlds/get-one", "POST", { worldId: this.worldId });
      if (!result) {
        this.reloadingRealm = false;
        return;
      }
      this.realm = JSON.parse(result) as Realm;
      this.reloadingRealm = false;
    },
		removePlayer(uuid: string){
			this.realm.players = this.realm?.players?.filter(p => p.uuid != uuid) || [];
		},
		updateOPs(newOPs: Ops) {
			let ops = newOPs.ops;
			for(let p of this.realm?.players as RealmsPlayer[]){
				if(ops.includes(p.name)) p.operator = true;
				else p.operator = false;
			}
		}
  }
});

type WorldType = "NORMAL" | "ADVENTUREMAP" | "MINIGAME";
type TemplateType = "MINIGAME" | "ADVENTUREMAP" | "EXERIENCE" | "NORMAL" | "INSPIRATION";
type SlotNumber = 1 | 2 | 3;

interface Realm {
	id: number,
	remoteSubscriptionId: string,
	owner: string,
	ownerUUID: string,
	name: string,
	motd: string,
	state: string,
	daysLeft: number,
	expired: boolean,
	expiredTrial: boolean,
	gracePeriod: boolean,
	worldType: WorldType,
	players: RealmsPlayer[] | null,
	maxPlayers: number,
	minigameName: string | null,
	minigameId: number | null,
	minigameImage: string | null,
	activeSlot: SlotNumber,
	slots: Slot[] | null,
	member: boolean,
	clubId: number,
	subscriptionRefreshStatus: any | null,
}

interface RealmsPlayer {
	uuid: string,
	name: string,
	operator: boolean,
	accepted: boolean,
	online: boolean,
	permission: "MEMBER" | "OPERATOR",
}

interface Slot {
	options: JSON,
	slotId: SlotNumber
}

export interface Ops {
	ops: string[];
}
</script>

<style>
.world {
  text-align: left;
	width: 100%;
}

.world-content {
	width: 100%;
}
</style>