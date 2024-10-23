import { tabEvent, deleteEvent, clickEvent, createKeyboardEvent, returnToStart } from "./events";
import { tilesInSundayAcross } from "./constants";

const setAutocheckState = (enable: boolean): void => {
	const autocheckButton = Array.from(document.querySelectorAll("button.xwd__menu--btnlink")).find(
		(button) => button.textContent?.trim() === "Autocheck"
	);
	if (!autocheckButton) {
		throw new Error("Cannot find autocheck button");
	}

	if (
		(enable && !autocheckButton.parentElement?.classList.contains("xwd__menu--item-checked")) ||
		(!enable && autocheckButton.parentElement?.classList.contains("xwd__menu--item-checked"))
	) {
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

	// Prior to adding 10 to the numOfCluesAcross, the puzzle did not clear completely; I never figured out why
	for (let x = 0; x < numOfCluesAcross + 10; x++) {
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

const closePopup = async (animationFrames: number): Promise<void> => {
	// wait for popup button to arrive
	await new Promise((resolve) => requestAnimationFrame(resolve));

	const popupButton = document.querySelector(".pz-moment__button:not(.secondary)");
	if (popupButton instanceof HTMLElement) {
		popupButton.click();
	} else {
		return;
	}

	// wait for popup button to disappear and animation to end, not exactly sure why we need multiple
	// if this does not work well, I would go back to a timeout: await new Promise((resolve) => setTimeout(resolve, 250));
	for (let i = 0; i < animationFrames; i++) {
		await new Promise((resolve) => requestAnimationFrame(resolve));
	}
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "runCrosswordHelper") {
		runCrosswordHelper(message.letters, message.autocheck)
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

const runCrosswordHelper = async (letters: string[], leaveAutocheckOn: boolean): Promise<void> => {
	await closePopup(30);
	setAutocheckState(true);
	await closePopup(10);

	fillPuzzle(letters);

	// wait for popup button to arrive
	await new Promise((resolve) => requestAnimationFrame(resolve));

	const popupButton = document.querySelector(".pz-moment__button:not(.secondary)");
	if (popupButton instanceof HTMLElement) {
		popupButton.click();
	}

	await closePopup(4);

	await clearPuzzle();

	if (!leaveAutocheckOn) {
		setAutocheckState(false);
	}
};
