<template>
  <div class="overview">
    <h2>Your realms</h2>
    <div class="realms-list" :class="{ loading: loading }">
      <realm v-for="realm in myServers" v-bind:key="realm" :realm="realm" :owner="true" />
    </div>
    <h2>All realms</h2>
    <div class="realms-list" :class="{ loading: loading }">
      <realm v-for="realm in allServers" v-bind:key="realm" :realm="realm" :owner="false" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import request from "../components/request-mixin";
import Realm from "../components/Realm.vue";

export default defineComponent({
  mixins: [request],
  components: {
    Realm,
  },
  data() {
    return {
      loading: true,
      myServers: new Array(),
      allServers: new Array(),
    };
  },
  async mounted() {
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
	methods: {
		sortRealms(a: RealmI, b: RealmI): number {
			if(a.expired && !b.expired) return 1;
			if(!a.expired && b.expired) return -1;
			return 0;
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
}

.realms-list {
  position: relative;
  min-height: 30px;
  display: flex;
  flex-wrap: wrap;
}
</style>