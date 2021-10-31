<template>
  <div class="world">
    <div v-if="!this.realm" class="loading"></div>
    <div class="world-content" v-if="!!this.realm">
			<div class="flex">
				<realm-info :realm="realm" :worldId="worldId" @toggle-open="toggleOpen" @open-realm-settings="openRealmSettings" />
				<realm-subscription :realm="realm" :worldId="worldId"/>
			</div>
			<transition name="grow">
				<realm-settings v-if="realmSettingsOpen" :realmName="realm.name" :realmDescription="realm.motd" :worldId="worldId" @close="closeRealmSettings" />
			</transition>
			<slots :realm="realm" :worldId="worldId" @select-slot="selectSlot" @open-settings="openSlotSettings" @open-reset-world="openSlotResetSettings" @open-minigame="openMinigame"/>
			<transition name="grow">
				<slot-setting v-if="slotSettingsOpen" :worldId="worldId" :slotId="realm.activeSlot" :settings="realm.slots[realm.activeSlot - 1].options" @update-slot-settings="updateSlotSettings" @close="closeSlotSettings"/>
			</transition>
			<transition name="grow">
				<reset-world v-if="slotResetSettingsOpen" :worldId="worldId" @close="closeSlotResetSettings" @open-template="openTemplateSettings" @close-template="closeTemplateSettings"/>
			</transition>
			<transition name="grow">
				<templates v-if="templateSelection!=''" :type="templateSelection" @close="closeTemplateSettings" @set-template="setTemplate" :worldId="worldId"/>
			</transition>
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
import RealmInfo from "../components/RealmInfo.vue";
import RealmSubscription from "../components/RealmSubscription.vue";
import Slots from "../components/Slots.vue";
import SlotSetting from "../components/slots/SlotSettings.vue";
import ResetWorld from "../components/slots/ResetWorld.vue";
import Templates from "../components/slots/Templates.vue";

export default defineComponent({
  mixins: [request],
  components: {
    RealmSettings,
		RealmPlayers,
		RealmInfo,
		RealmSubscription,
		Slots,
		SlotSetting,
		ResetWorld,
		Templates,
  },
  props: {
    worldId: String
  },
  data() {
    return {
      realm: null as unknown as Realm,
      reloadingRealm: false,
			slotSettingsOpen: false,
			slotResetSettingsOpen: false,
			realmSettingsOpen: false,
			templateSelection: "",
    }
  },
  async mounted() {
    this.reloadRealm();
  },
  methods: {
    async reloadRealm(_realm?: Realm) {
      if (this.reloadingRealm) return;
			if (_realm){
				this.realm = _realm;
				return;
			}
      this.reloadingRealm = true;
      let result = await this.sendRequest("/worlds/get-one", "POST", { worldId: this.worldId });
      if (!result) {
        this.reloadingRealm = false;
        return;
      }
      this.realm = JSON.parse(result) as Realm;
      this.reloadingRealm = false;
			console.log(this.realm);
			
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
		},
		toggleOpen() {
			this.realm.state = this.realm.state == "OPEN" ? "CLOSED" : "OPEN";
		},
		selectSlot(_slot: SlotNumber) {
			this.realm.activeSlot = _slot;
			this.realm.worldType = 'NORMAL';
		},
		openSlotSettings() {
			this.slotSettingsOpen = true;
			this.slotResetSettingsOpen = false;
			this.templateSelection = "";
		},
		closeSlotSettings(){
			this.slotSettingsOpen = false;
		},
		openSlotResetSettings() {
			if(!this.slotResetSettingsOpen) {
				this.templateSelection = "";
			}
			this.slotResetSettingsOpen = true;
			this.slotSettingsOpen = false;
		},
		closeSlotResetSettings(){
			this.slotResetSettingsOpen = false;
		},
		openRealmSettings() {
			this.realmSettingsOpen = true;
		},
		closeRealmSettings() {
			this.realmSettingsOpen = false;
		},
		updateSlotSettings(settings: SlotSettings, slot: number): void {
			slot -= 1;
			if(this.realm?.slots && this.realm?.slots[slot]){
				this.realm.slots[slot].options = JSON.stringify(settings);
			}
		},
		openMinigame(){
			this.slotSettingsOpen = false;
			this.slotResetSettingsOpen = false;
			this.templateSelection = "MINIGAME";
		},
		openTemplateSettings(_type: TemplateType){
			this.templateSelection = _type;
		},
		closeTemplateSettings(){
			this.templateSelection = "";
		},
		setTemplate(t: any) {
			if(t.type == "MINIGAME") {
				this.realm.minigameName = t.name;
				this.realm.minigameId = t.id;
				this.realm.minigameImage = t.image;
				this.realm.worldType = "MINIGAME";
				return;
			}
			let slot = this.realm?.slots?.find(s => s.slotId == this.realm.activeSlot);
			if (!slot) return;
			let options: SlotSettings = JSON.parse(slot.options);
			options.worldTemplateImage = undefined;
			options.gameMode = 0;
			options.difficulty = 2;
			options.forceGameMode = false;
			options.spawnProtection = 0;
			options.pvp = true;
			options.spawnAnimals = true;
			options.spawnMonsters = true;
			options.spawnNPCs = true;
			options.commandBlocks = false;
			this.realm.worldType = "NORMAL";
			if(t.type != "NORMAL") {
				this.realm.worldType = "ADVENTUREMAP";
				options.slotName = t.name;
				options.worldTemplateId = t.id;
				options.worldTemplateImage = t.image;
				options.adventureMap = true;
				options.commandBlocks = true;
			}
			slot.options = JSON.stringify(options);
		},
  }
});

export type WorldType = "NORMAL" | "ADVENTUREMAP" | "MINIGAME";
export type TemplateType = "MINIGAME" | "ADVENTUREMAP" | "EXPERIENCE" | "NORMAL" | "INSPIRATION";
export type SlotNumber = 1 | 2 | 3;

export interface Realm {
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

export interface RealmsPlayer {
	uuid: string,
	name: string,
	operator: boolean,
	accepted: boolean,
	online: boolean,
	permission: "MEMBER" | "OPERATOR",
}

export interface Slot {
	options: string,
	slotId: SlotNumber
}

export interface SlotSettings {
	slotName?: string,
	pvp?: boolean,
	spawnAnimals?: boolean,
	spawnMonsters?: boolean,
	spawnNPCs?: boolean,
	spawnProtection?: number,
	commandBlocks?: boolean,
	forceGameMode?: boolean,
	gameMode?: number,
	difficulty?: number,
	worldTemplateId?: number,
	worldTemplateImage?: string,
	adventureMap?: boolean,
	resourcePackHash?: null
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

<style scoped>
.flex {
	display: flex;
	flex-wrap: wrap;
}

.flex > div {
	width: calc(50% - 2em);
	box-sizing: border-box;
}

@media screen and (max-width: 1056px) {
	.flex > div {
		width: 100%;
	}
}
</style>