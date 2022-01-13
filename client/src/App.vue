<template>
  <div>
		<Header />
    <div id="content-wrapper">
      <div id="content">
        <router-view />
      </div>
      <Footer />
    </div>
    <error-display />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ErrorDisplay from "./components/ErrorDisplay.vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import settings from "./components/settings-mixin";

export default defineComponent({
  mixins: [settings],
  components: {
    ErrorDisplay,
    Header,
    Footer,
  },
  beforeMount() {
    this.checkSettings();
    console.log("before Mount: App", this.pageSettings);
    this.checkDarkmode();
    window.addEventListener("settingsUpdated", this.checkDarkmode);
  },
  methods: {
    checkDarkmode() {
      if (this.pageSettings.darkMode) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }
  }
});
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--font-color);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: var(--font-color);
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
  position: relative;
}

@media screen and (max-width: 1056px) {
  #content {
    max-width: 95%;
    box-sizing: border-box;
  }
}

#content-wrapper {
  display: grid;
  place-items: center;
  margin: 3em 0;
  min-height: 90vh;
}

</style>
