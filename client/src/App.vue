<template>
  <div>
		<div id="content-wrapper">
			<Header/>
			<div id="content">
				<router-view />
			</div>
		</div>
    <error-display />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ErrorDisplay from "./components/ErrorDisplay.vue";
import Header from "./components/Header.vue";

export default defineComponent({
  components: {
    ErrorDisplay,
    Header,
  },
});
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#content {
	background-color: var(--foreground);
	border-radius: 1em;
	max-width: 80%;
	padding: 1em;
	min-width: 50%;
	min-height: 300px;
	display: grid;
  place-items: center;
}

#content-wrapper {
	display: grid;
  place-items: center;
	margin: 3em 0;
	min-height: 90vh;
}

</style>
