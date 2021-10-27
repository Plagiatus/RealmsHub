
import { defineComponent } from "vue";


export interface PageSettings {
	darkMode: boolean
}
export interface CookieSettings {
	neccessaryCookies: boolean;
}


export default defineComponent({
	name: "settings",
	data() {
		return {
			pageSettings: {} as PageSettings,
			cookieSettings: {} as CookieSettings,
			defaultPageSettings: {
				darkMode: false,
			} as PageSettings,
			defaultCookieSettings: {
				neccessaryCookies: true,
			} as CookieSettings,
		}
	},
	methods: {
		reloadSettings() {
			this.pageSettings = JSON.parse(localStorage.getItem("pageSettings") || JSON.stringify(this.defaultPageSettings));
			this.cookieSettings = JSON.parse(localStorage.getItem("cookieSettings") || JSON.stringify(this.defaultCookieSettings));
			window.dispatchEvent(new CustomEvent("settingsUpdated"))
		},
		checkSettings() {
			if (!localStorage.getItem("pageSettings")) {
				localStorage.setItem("pageSettings", JSON.stringify(this.defaultPageSettings));
			}
			if (!localStorage.getItem("cookieSettings")) {
				localStorage.setItem("cookieSettings", JSON.stringify(this.defaultCookieSettings));
			}
			this.reloadSettings();
		},
	},
	mounted() {
		this.reloadSettings();
		window.addEventListener("updatedSettings", this.reloadSettings);
	},
});