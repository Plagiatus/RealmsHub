<template>
	<div class="collapsible">
		<div class="collapsible-headline" :class="{'collapsible-open': open}" @click="toggle">{{headline}}</div>
		<div class="collapsible-content" :class="{'collapsible-visible': open}">{{content}}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: "Collapsible",
	props: ["headline","content"],
	data(){
		return {
			open: false
		}
	},
	methods: {
		toggle() {
			this.open = !this.open;
		}
	}
})
</script>

<style>
.collapsible {
	text-align: left;
	background-color: var(--btn-dark-green);
}

.collapsible-headline {
	padding: 1em;
	cursor: pointer;
	color: var(--background);
}

.collapsible:nth-of-type(2n){
	background-color: var(--highlight);
}

.collapsible-content {
	display: none;
	overflow: hidden;
	padding: 1em;
	background-color: var(--background);
}

.collapsible-visible {
	display: block;
}

.collapsible-headline::after {
	content: '\02795';
	float: right;
	color: var(--background);
	margin-left: 5px;
}
.collapsible-open::after {
	content: "\2796";
}
</style>