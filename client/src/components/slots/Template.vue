<template>
  <div class="template">
    <img class="template-img" :src="imgsource" alt="minigame logo" />
    <div class="template-info">
      <span class="template-name">{{ template.name }}</span>
      <a :href="template.link" target="_blank" v-if="template.link" class="template-author">
				{{ template.author }}
				<img src="../../assets/external-link.svg" alt="" class="template-name-link-icon">
			</a>
      <span v-else class="template-author">{{ template.author }}</span>
      <span class="template-recommended keep-dark" v-if="template.recommendedPlayers"><img src="../../assets/players.svg" alt="">
				{{template.recommendedPlayers}}
			</span>
    </div>
    <div class="template-links">
      <div>
        <a
          class="template-trailer template-button"
          v-if="template.trailer"
          :href="template.trailer"
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
      <button class="btn light template-select" @click="select">Select</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Template } from "./Templates.vue";

export default defineComponent({
  props: ["template"],
  computed: {
    imgsource() {
      return "data:image/jpeg;base64," + this.template.image;
    }
  },
	methods: {
		select() {
			this.$emit("selectTemplate", this.template.id);
		}
	}
})
</script>

<style>
.template {
  display: grid;
	grid-template-columns: auto 1fr auto;
  margin: 0.25em;
  padding: 0.75em;
  background-color: var(--foreground-gray);
  border-radius: 1rem;
	box-shadow: 0 0 4px rgba(0, 0, 0, .1);
}

.template-info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.template-select {
  width: max-content;
}

.template-links {
  margin-left: auto;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
	text-align: center;
}

.template-img {
  margin-right: 1em;
  width: 100px;
}

.template-name {
  color: var(--highlight);
  font-size: 1.3em;
}

.template-author {
  font-size: 1.1em;
}
a.template-author, 
a.template-author:visited,
.template-author {
  color: var(--gold);
}

.template-recommended {
  color: var(--font-color);
  font-size: 0.8em;
  background-color: var(--btn-slight-red);
  padding: 0.3em 0.5em;
  border-radius: 0.2em;
  width: max-content;
}

.template-recommended > img {
	height: 1.2em;
	margin-right: .3em;
	top: .1em;
	position: relative;
}

.template-button > img {
  width: 2em;
  filter: var(--highlight-filter);
}

.template-name-link-icon {
	filter: var(--gold-filter);
	height: .8em;
	margin-left: .3em;
}

@media screen and (max-width: 660px) {
	.template {
		font-size: .8em;
		grid-template-rows: auto auto;
		grid-template-columns: auto 1fr;

	}

	.template-links {
		grid-template-columns: 100px 1fr auto;
		grid-template-rows: auto;
		grid-column: 1 / span 2;
		width: 100%;
		margin-top: .2em;
	}
}
</style>
