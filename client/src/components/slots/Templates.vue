<template>
  <div id="template-overlay" class="gray-block">
    <h2>{{ title }}</h2>
    <hr />
    <div id="template-search">
      <div>
        <div id="search-options">
          <div class="input-group">
            <input
              type="text"
              id="search-name"
              class="input search"
              placeholder="Search minigames"
              v-model="search.name"
            />
          </div>
          <details>
            <summary class="bold" style="cursor: pointer">Filters</summary>
            <div class="input-filters">
              <div class="input-filter">
                <label for="advancedAuthor">Creator</label>
                <input
                  type="text"
                  id="advancedAuthor"
                  class="input search"
                  v-model="search.author"
                />
              </div>
              <div class="input-filter">
                <label for="advancedPlayers">Players</label>
                <div id="input-filter-distribute">
                  <label id="advanced-players-label">{{
                    searchPlayerAmount
                  }}</label>
                  <input
                    type="range"
                    id="advancedPlayers"
                    class="slider"
                    v-model="search.players"
                    min="0"
                    max="11"
                  />
                </div>
              </div>
              <div class="input-filter-no-grow">
                <button
                  class="btn light"
                  v-if="advancedOptions"
                  @click="chooseRandomMap"
                >
                  Random
                </button>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
    <div id="template-selected">
      <div v-if="selectedTemplate.id">
        <img
          class="template-img"
          :src="'data:image/jpeg;base64,' + selectedTemplate.image"
          alt="Minigame Logo"
        />
        <div class="template-info">
          <span class="template-name">{{ selectedTemplate.name }}</span>
          <a
            :href="selectedTemplate.link"
            target="_blank"
            v-if="selectedTemplate.link"
            class="template-author"
          >
            {{ selectedTemplate.author }}
						<img src="../../assets/external-link.svg" alt="" class="template-name-link-icon">
          </a>
          <span v-else class="template-author">{{
            selectedTemplate.author
          }}</span>
          <span
            class="template-recommended keep-dark"
            v-if="selectedTemplate.recommendedPlayers"
          >
            <img src="../../assets/players.svg" alt="" />
            {{ selectedTemplate.recommendedPlayers }}
          </span>
        </div>
        <div class="template-links">
          <div style="text-align: right;">
            <a
              class="template-trailer template-button"
              v-if="selectedTemplate.trailer"
              :href="selectedTemplate.trailer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="../../assets/film.svg"
                title="Map Trailer"
                alt="Map Trailer"
              />
            </a>
          </div>
          <div></div>
					<div>
						<span id="template-confirm-button" class="italic">This will take around 30 seconds.</span>
						<loading-button
							:text="'Confirm'"
							:successText="'Map loaded!'"
							:loading="loadingTemplateOntoRealm"
							@click="confirmSelection"
						/>
					</div>
        </div>
      </div>
      <div v-else style="display: flex; justify-content:center; align-items: center; height: 100%">
				<span>
					No {{ maptype }} selected.
				</span>
			</div>
    </div>
    <div id="template-wrapper" :class="{ loading: loadingTemplates }">
      <one-template
        :template="template"
        v-for="template in queriedTemplates"
        v-bind:key="template"
        @select-template="selectTemplate"
      />
      <span v-if="queriedTemplates.length == 0 && !loadingTemplates">
        We've looked far and wide, but no templates matched your search. Try
        adjusting your search settings.
      </span>
    </div>
    <span @click="close" class="close">
      <img src="../../assets/x.svg" alt="close" />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import request from "../request-mixin";
import { TemplateType } from "../../views/World.vue";
import OneTemplate from "./Template.vue";
import LoadingButton from "../LoadingButton.vue";

export default defineComponent({
  props: ["type", "worldId"],
  mixins: [request],
  components: {
    OneTemplate,
    LoadingButton,
  },
  data() {
    return {
      loadingTemplates: false,
      templates: [] as Template[],
      selectedTemplate: {} as Template,
      advancedOptions: true,
      basicSearchString: "",
      search: {
        name: "",
        author: "",
        players: 0,
      },
      loadingTemplateOntoRealm: false,
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async loadTemplates() {
      this.templates = [];
			this.selectedTemplate = {};
      this.loadingTemplates = true;
      let result: string | undefined = await this.sendRequest("/templates/" + this.type + "/0/1", "SEARCH", {});
      this.loadingTemplates = false;
      if (!result) return;
      let results: Templates = JSON.parse(result);
      for (let i = 0; i < Math.ceil(results.total / 10); i++) {
        this.loadMultipleTemplates(i);
      }
    },
    async loadMultipleTemplates(page: number, size = 10) {
      let result: string | undefined = await this.sendRequest(`/templates/${this.type}/${page}/${size}`, "SEARCH");
      if (!result) return;
      let results: Templates = JSON.parse(result);
      this.templates.push(...results.templates);
    },
    doesTemplateFitQuery(t: Template): boolean {
      let fits = true;
      fits = fits && t.name.toLowerCase().includes(this.search.name.toLowerCase());
      fits = fits && t.author.toLowerCase().includes(this.search.author.toLowerCase());
      if (this.search.players > 0) {
        let range = this.playerRange(t);
        fits = fits && range[0] <= this.search.players && this.search.players <= range[1];
      }
      return fits;
    },
    playerRange(t: Template): [number, number] {
			if(!t.recommendedPlayers) return [0, 11];

      let numbers = t.recommendedPlayers.match(/[0-9]+/g);
      if (!numbers) {
        return [0, 11];
      }
      let min: number = parseInt(numbers[0]) || 0;
      let max: number = parseInt(numbers[1]) || 11;
      return [min, max];
    },
    chooseRandomMap() {
      let index = Math.floor(this.queriedTemplates.length * Math.random());
      this.selectTemplate(this.queriedTemplates[index].id);
    },
    selectTemplate(id: number) {
      this.selectedTemplate = this.templates.find(t => t.id == id);
    },
    async confirmSelection() {
      this.loadingTemplateOntoRealm = true;
      let path = "/worlds/reset-template";
      let body = { worldId: this.worldId, template: 0, minigame: 0 };
      if (this.type == "MINIGAME") {
        path = "/worlds/minigame";
        body.minigame = this.selectedTemplate.id;
      } else {
        body.template = this.selectedTemplate.id;
      }
      let result = await this.sendRequest(path, "POST", body)
      this.loadingTemplateOntoRealm = false;
      if (!result) return;
			setTimeout(this.close, 1000);
    },
  },
  watch: {
    type() {
      this.loadTemplates();
    }
  },
  computed: {
    title() {
      if (this.type == "MINIGAME") {
        return "Choose a Minigame to put into the minigame slot";
      }
      return `Choose a${this.type == "NORMAL" ? "" : "n"} ${this.maptype} to replace your world`;
    },
    maptype() {
      let maptype: string = this.type.toLowerCase();
      maptype = maptype.charAt(0).toUpperCase() + maptype.slice(1);
      if (this.type == "NORMAL") maptype = "World Template";
      return maptype;
    },
    queriedTemplates() {
      return this.templates.filter(this.doesTemplateFitQuery);
    },
    searchPlayerAmount(): string {
      if (this.search.players <= 0) {
        return "-";
      }
      return this.search.players.toString();
    },
  },
  mounted() {
    this.loadTemplates();
  }
});

interface Templates {
  templates: Template[],
  page: number,
  size: number,
  total: number,
}

export interface Template {
  id: number,
  name: string,
  version: string,
  author: string,
  link: string,
  image: string,
  trailer: string,
  recommendedPlayers: string,
  type: TemplateType,
}
</script>


<style>
#template-wrapper {
  max-height: 500px;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--foreground);
  padding: 1em;
  border: 1px solid var(--background);
}

#template-selected {
  height: 100px;
  background-color: var(--btn-light-green);
  margin: 1em 0;
  padding: 0.75em;
}

#template-selected > div {
  display: flex;
  flex-direction: row;
}

#template-selected > span {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
}

#template-search {
  display: flex;
}

#template-search > div:first-child {
  width: 1%;
  flex: 1 1 auto;
}

#template-advanced-options-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 1em;
}

#template-advanced-options-wrapper > button {
  margin-top: 1em;
}

.input-filter {
  display: flex;
  margin: 1em;
  flex-direction: column;
  flex: 1 1 auto;
}
.input-filter-no-grow {
  margin: 1em;
  display: flex;
  align-items: last baseline;
}

.input-filter > label {
  margin: 0.5em 0;
}

.input.search {
  background-image: url("../../assets/search.svg");
  background-repeat: no-repeat;
  background-size: 1em;
  background-position: 0.5em 0.5em;
  text-indent: 1em;
}

.input-filters {
  display: flex;
  flex-direction: row;
}

#search-name {
  margin-bottom: 1em;
}

#input-filter-distribute {
  display: flex;
  align-items: center;
}
#advanced-players-label {
  width: 2em;
}
#template-confirm-button {
	margin-right: .5em;
	font-size: .8em;
}
</style>