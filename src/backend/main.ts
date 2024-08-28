import { tabEvent, deleteEvent, clickEvent, createKeyboardEvent, returnToStart } from "./events";
import { tilesInSundayAcross } from "./constants";

console.log("NYT Crossword Helper content script loaded");

const enableAutocheck = (): void => {
	const autocheckButton = Array.from(document.querySelectorAll("button.xwd__menu--btnlink")).find(
		(button) => button.textContent?.trim() === "Autocheck"
	);

	if (autocheckButton && !autocheckButton.parentElement?.classList.contains("xwd__menu--item-checked")) {
		(autocheckButton as HTMLElement)?.click();
	}
};

const fillPuzzle = (charsToReveal: string[]): void => {
	returnToStart();
	const numOfCluesAcross =
		document.querySelector(".xwd__clue-list--list").querySelectorAll(".xwd__clue--li").length || 0;

	for (let x = 0; x < numOfCluesAcross; x++) {
		for (let i = 0; i < charsToReveal.length; i++) {
			for (let j = 0; j < tilesInSundayAcross; j++) {
				const highlightedCell = document.querySelector(".xwd__cell--highlighted");
				if (highlightedCell) {
					highlightedCell.dispatchEvent(
						createKeyboardEvent("keypress", {
							charCode: charsToReveal[i].charCodeAt(0),
							bubbles: true,
						})
					);
				}
			}
		}
		document.activeElement?.dispatchEvent(tabEvent);
	}
};

const clearPuzzle = async (): Promise<void> => {
	returnToStart();
	await new Promise((resolve) => requestAnimationFrame(resolve));

	const numOfCluesAcross =
		document.querySelector(".xwd__clue-list--list").querySelectorAll(".xwd__clue--li").length || 0;

	for (let x = 0; x < numOfCluesAcross; x++) {
		const currSelectedLetters = document.querySelectorAll(".xwd__cell--highlighted");
		const lastElement = currSelectedLetters[currSelectedLetters.length - 1];
		const selectedCell = document.querySelector(".xwd__cell--selected");

		if (lastElement && selectedCell && lastElement.id !== selectedCell.id) {
			lastElement.dispatchEvent(clickEvent);
		}

		for (let i = 0; i < tilesInSundayAcross; i++) {
			lastElement?.dispatchEvent(deleteEvent);
		}
		document.activeElement?.dispatchEvent(tabEvent);
		await new Promise((resolve) => requestAnimationFrame(resolve));
	}
	returnToStart();
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "runCrosswordHelper") {
		runCrosswordHelper(message.letters)
			.then(() => {
				sendResponse({ success: true });
			})
			.catch((error) => {
				sendResponse({ success: false, error: error.message });
			});
		return true; // Indicates that the response will be sent asynchronously
	}
	// Handle other message types if needed
});

const runCrosswordHelper = async (letters: string[]): Promise<void> => {
	enableAutocheck();
	fillPuzzle(letters);

	// wait for popup button to arrive
	await new Promise((resolve) => setTimeout(resolve, 1000));

	const popupButton = document.querySelector(".pz-moment__button:not(.secondary)");
	if (popupButton instanceof HTMLElement) {
		popupButton.click();
	}

	// wait for popup button to disappear
	await new Promise((resolve) => setTimeout(resolve, 250));

	await clearPuzzle();
};
