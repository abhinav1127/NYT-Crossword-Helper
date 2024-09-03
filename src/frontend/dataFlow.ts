export function sendMessageToActiveTab(message: any): Promise<any> {
	return new Promise((resolve, reject) => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const tab = tabs[0];
			if (!tab?.id || !tab.url?.startsWith("https://www.nytimes.com/crosswords/game")) {
				reject(new Error("Not on NYT Crossword page"));
				return;
			}
			chrome.tabs.sendMessage(tab.id, message, function (response) {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve(response);
				}
			});
		});
	});
}

export function saveState() {
	const letterInputs = document.querySelectorAll<HTMLInputElement>(".letter-input");
	const letters = Array.from(letterInputs).map((input) => input.value);
	const autocheckOn = (document.getElementById("autocheck-toggle") as HTMLInputElement).checked;

	if (chrome.storage && chrome.storage.local) {
		chrome.storage.local.set({ letters, autocheckOn }, function () {
			if (chrome.runtime.lastError) {
				console.error("Error saving state:", chrome.runtime.lastError);
			}
		});
	} else {
		console.error("Chrome storage API is not available");
	}
}

export function loadSavedState() {
	if (chrome.storage && chrome.storage.local) {
		chrome.storage.local.get(["letters", "autocheckOn"], function (result) {
			if (chrome.runtime.lastError) {
				console.error("Error loading state:", chrome.runtime.lastError);
				return;
			}

			const letterInputs = document.querySelectorAll<HTMLInputElement>(".letter-input");
			const checkbox = document.getElementById("autocheck-toggle") as HTMLInputElement;

			if (result.letters) {
				result.letters.forEach((letter: string, index: number) => {
					if (letterInputs[index]) {
						letterInputs[index].value = letter;
					}
				});
			}

			if (result.autocheckOn !== undefined) {
				checkbox.checked = result.autocheckOn;
			}

			// Focus on the first empty input
			const firstEmptyInput = Array.from(letterInputs).find((input) => !input.value);
			if (firstEmptyInput) {
				firstEmptyInput?.focus();
			} else {
				letterInputs[letterInputs.length - 1]?.focus();
			}
		});
	} else {
		console.error("Chrome storage API is not available");
	}
}
