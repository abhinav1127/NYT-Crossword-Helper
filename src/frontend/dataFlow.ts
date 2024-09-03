import { SELECTORS, STORAGE_KEYS, NYT_CROSSWORD_URL } from "./constants";

export function sendMessageToActiveTab(message: any): Promise<any> {
	return new Promise((resolve, reject) => {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const tab = tabs[0];
			if (!tab?.id || !tab.url?.startsWith(NYT_CROSSWORD_URL)) {
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
	const letterInputs = document.querySelectorAll<HTMLInputElement>(SELECTORS.LETTER_INPUT);
	const letters = Array.from(letterInputs).map((input) => input.value);
	const autocheckOn = (document.getElementById(SELECTORS.AUTOCHECK_TOGGLE) as HTMLInputElement).checked;

	if (chrome.storage && chrome.storage.local) {
		chrome.storage.local.set(
			{ [STORAGE_KEYS.LETTERS]: letters, [STORAGE_KEYS.AUTOCHECK_ON]: autocheckOn },
			function () {
				if (chrome.runtime.lastError) {
					console.error("Error saving state:", chrome.runtime.lastError);
					return;
				}
			}
		);
	} else {
		console.error("Chrome storage API is not available");
	}
}

export function loadSavedState() {
	if (chrome.storage && chrome.storage.local) {
		chrome.storage.local.get([STORAGE_KEYS.LETTERS, STORAGE_KEYS.AUTOCHECK_ON], function (result) {
			if (chrome.runtime.lastError) {
				console.error("Error loading state:", chrome.runtime.lastError);
				return;
			}

			const letterInputs = document.querySelectorAll<HTMLInputElement>(SELECTORS.LETTER_INPUT);
			const checkbox = document.getElementById(SELECTORS.AUTOCHECK_TOGGLE) as HTMLInputElement;

			if (result[STORAGE_KEYS.LETTERS]) {
				result[STORAGE_KEYS.LETTERS].forEach((letter: string, index: number) => {
					if (letterInputs[index]) {
						letterInputs[index].value = letter;
					}
				});
			}

			if (result[STORAGE_KEYS.AUTOCHECK_ON] !== undefined) {
				checkbox.checked = result[STORAGE_KEYS.AUTOCHECK_ON];
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
