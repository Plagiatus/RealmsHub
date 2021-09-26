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
import request from "@/components/request-mixin";
import Realm from "@/components/Realm";

export default defineComponent({
  mixins: [request],
  components: {
    Realm,
  },
  data() {
    return {
      loading: true,
      myServers: [],
      allServers: [],
    };
  },
  async mounted() {
    let id = localStorage.getItem("id");
    let result: string = await this.sendRequest("/worlds", "POST", { id });
    if (!result) return;
    let allServers = JSON.parse(result).servers;
    this.myServers = [];
    this.allServers = [];
    let user: string = localStorage.getItem("user");
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
		sortRealms(a, b): number {
			if(a.expired && !b.expired) return 1;
			if(!a.expired && b.expired) return -1;
			return 0;
		}
	}
});
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