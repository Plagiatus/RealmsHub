<template>
    <div id="backups" class="gray-block">
        <h2>Backups</h2>
        <div v-if="loading" class="loading"></div>
        <div id="backups-list" v-if="(backups.length > 0)">
            <div class="single-backup" v-for="(backup, index) in backups" v-bind:key="backup.backupId">
                <div class="backup-info">
                    <span class="backup-title">Backup #{{index+1}}</span>
                    <span class="backup-size">{{beautifySize(backup.size)}}</span>
                    <span class="backup-date">{{new Date(backup.lastModifiedDate).toLocaleString()}}</span>
                    <button class="btn backup-button-dl" v-if="(index === 0)" @click="downloadLatest">Download</button>
                </div>
                <div class="backup-buttons">
                    <loading-button :red="true" :text="'Restore'" :successText="'Restored!'" :loading="restoring" @click="restoreBackup(backup.backupId)"/>
                </div>
            </div>
        </div>
		<span @click="close" class="close"><img src="../../assets/x.svg" alt="close"></span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "../request-mixin";
import LoadingButton from '../LoadingButton.vue';

export default defineComponent({  
    props: ["worldId", "slotId"],
    mixins: [request],
    
	components: {
        LoadingButton
    },
    data() {
        return {
            backups: [] as Backup[],
            loading: false,
            restoring: false,
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
        async restoreBackup(backupId: string){
            this.restoring = true;
            let result: string | undefined = "";
            let counter = 0;
            while(result !== "true"){
                result = await this.sendRequest("/worlds/restore-backup", "POST", {worldId: this.worldId, backupId});
                if(!result) return;
                counter++;
                if(counter > 5){
                    window.dispatchEvent(new CustomEvent("displayError", {
					detail: {
						code: 500,
						message: "Couldn't restore backup. Try again later.",
					}
				}));
                }
            }
            this.restoring = false;
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
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
.backup-button-dl {
    margin-top: 0.5em;
}
</style>