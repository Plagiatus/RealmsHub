<template>
    <div id="backups" class="gray-block">
        <h2>Backups</h2>
        <div v-if="loading" class="loading"></div>
        <div id="backups-list" v-if="(backups.length > 0)">
            <div class="single-backup" v-for="(backup, index) in backups" v-bind:key="backup.backupId">
                <span class="backup-title">Backup #{{index+1}}</span>
                <span class="backup-size">{{beautifySize(backup.size)}}</span>
                <button class="btn backup-button" v-if="(index === 0)" @click="downloadLatest">Download</button>
                <span class="backup-date">{{new Date(backup.lastModifiedDate).toLocaleString()}}</span>
            </div>
        </div>
		<span @click="close" class="close"><img src="../../assets/x.svg" alt="close"></span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "../request-mixin";

export default defineComponent({  
    props: ["worldId", "slotId"],
    mixins: [request],
    
	components: {},
    data() {
        return {
            backups: [] as Backup[],
            loading: false,
        }
    },
    methods: {
        async getBackups() {
            this.loading = true;
            let result = await this.sendRequest("/worlds/backups/", "POST", {worldId: this.worldId});
            if (!result) return;
            this.backups = JSON.parse(result).backups;
            this.loading = false;
        },
        async downloadLatest() {
            let result = await this.sendRequest("/worlds/slot/download", "POST", {worldId: this.worldId, slot: this.slotId});
            if(!result) return;
            let link = JSON.parse(result).downloadLink;
            window.open(link, "_blank")
        },
        beautifySize(size: number){
            const suffixes = ["B", "kB", "MB", "GB"];
            let suffixToChoose = 0;
            while(size > 1000) {
                size /= 1000;
                suffixToChoose++;
            }
            return `${size.toPrecision(3)} ${suffixes[suffixToChoose]}`
        },
        close() {
			this.$emit("close");
		},
    },
    mounted() {
        this.getBackups();
    },
    watch: {
        slotId() {
            this.backups = [];
            this.getBackups();
        }
    }
});

interface Backup {
    backupId: string,
    lastModifiedDate: number,
    size: number,
    metadata: {
        game_difficulty: string,
        name: string,
        game_server_version: string,
        enabled_packs: string,
        description: string,
        game_mode: string,
        world_type: string,
    }
}
</script>

<style>
.single-backup {
    border-top: 2px solid var(--foreground);
    padding: 0.5em 0;
}

.backup-date {
    display: block;
}

.backup-size {
    margin-left: 1em;
    font-style: italic;
    font-size: small;
}

.backup-title {
    font-size: 1.25em;
    line-height: 2;
}

.backup-button {
    float: right;
}
</style>