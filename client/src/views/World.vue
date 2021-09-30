<template>
  <div class="world">
    <div v-if="!this.realm" class="loading"></div>
    <div v-if="!!this.realm">
      <realm-settings :realmName="realm.name" :realmDescription="realm.motd" :worldId="worldId" />
    </div>
    <p><em>More features are being worked on and coming soon!</em></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "../components/request-mixin";
import RealmSettings from "../components/RealmSettings.vue";

export default defineComponent({
  mixins: [request],
  components: {
    RealmSettings
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
    async reloadRealm() {
      if (this.reloadingRealm) return;
      this.reloadingRealm = true;
      let id = localStorage.getItem("id");
      let result = await this.sendRequest("/worlds/get-one", "POST", { worldId: this.worldId });
      if (!result) {
        this.reloadingRealm = false;
        return;
      }
      this.realm = JSON.parse(result) as Realm;
      this.reloadingRealm = false;
    }
  }
});

interface Realm {
  id: number,
  name: string,
  motd: string,

}

</script>

<style>
.world {
  text-align: left;
}
</style>