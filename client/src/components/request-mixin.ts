import { defineComponent } from "vue";

type DismissFunction = () => void;

const url: URL = new URL(window.location.href);
const requestUrl: string = (url.hostname == "localhost") ? "http://localhost:9001" : "https://api.realmshub.com";

export default defineComponent({
	name: "request",
	methods: {
		async sendRequest(_url: string, _method: "GET" | "POST", _data: any = {}, _errorMessage?: string, _errorDismissEvent?: DismissFunction): Promise<string | undefined> {
			let response: Response;
			if (_method == "GET") {
				response = await fetch(requestUrl + _url);
			} else if (_method == "POST") {
				_data["id"] = localStorage.getItem("id");
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
						message: _errorMessage || response.statusText,
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
								message: _errorMessage || resp.error.message || genericCodeDescription(resp.error.code),
								dismissEvent: _errorDismissEvent
							}
						}));
						return;
					}
					if (resp.code) {
						window.dispatchEvent(new CustomEvent("displayError", {
							detail: {
								code: resp.code,
								message: _errorMessage || resp.message || genericCodeDescription(resp.code),
								dismissEvent: _errorDismissEvent
							}
						}));
						return;
					}
					if (resp.errorCode) {
						window.dispatchEvent(new CustomEvent("displayError", {
							detail: {
								code: resp.errorCode,
								message: _errorMessage || resp.errorMsg || genericCodeDescription(resp.code),
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

function genericCodeDescription(code: number): string {
	switch (code) {
		case 400:
			return "The client sent a bad request to the server.";
		case 401:
		case 403:
			return "You are not authorized to do this. Try logging out and back in.";
		case 404:
			return "The requested resource could not be found on the server.";
		case 405:
			return "The client sent a request to the server that used a wrong method.";
		case 408:
			return "Your request timed out.";
		case 410:
			return "The request tried to access a resource that is gone and won't come back.";
		case 500:
			return "Something went wrong on the server side. Please try again later.";
		case 503:
			return "The server is currently overloaded. Please try again at a later point in time.";
	}
	return "An unknown Error occurred."
}