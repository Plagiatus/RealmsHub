import { defineComponent } from "vue";

type DismissFunction = () => void;

const url: URL = new URL(window.location.href);
const requestUrl: string = (url.hostname == "localhost") ? "http://localhost:9001" : "https://api.realmshub.com";

export default defineComponent({
	name: "request",
	methods: {
		async sendRequest(_url: string, _method: "GET" | "POST", _data?: any, _errorDismissEvent?: DismissFunction): Promise<string | undefined> {
			let response: Response;
			if (_method == "GET") {
				response = await fetch(requestUrl + _url);
			} else if (_method == "POST") {
				response = await fetch(requestUrl + _url, {
					method: _method,
					body: JSON.stringify(_data),
					headers: { "Content-Type": "application/json" },
				});
			} else {
				return;
			}

			if (!response.ok) {
				window.dispatchEvent(new CustomEvent("displayError", {
					detail: {
						code: response.status,
						message: response.statusText,
						dismissEvent: _errorDismissEvent
					}
				}));
				return;
			}

			const responseText: string = await response.text();
			if (responseText != "") {
				try {
					const resp = JSON.parse(responseText);
					if (resp.error) {
						window.dispatchEvent(new CustomEvent("displayError", {
							detail: {
								code: resp.error.code,
								message: resp.error.message,
								dismissEvent: _errorDismissEvent
							}
						}));
						return;
					}
				} catch (error) {
					//
				}
			}
			return responseText;
		}
	}
});