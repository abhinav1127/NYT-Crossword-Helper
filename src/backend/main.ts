import { tabEvent, deleteEvent, clickEvent, createKeyboardEvent, returnToStart } from "./events";
import { tilesInSundayAcross } from "./constants";

const numOfCluesAcross = document.querySelector(".xwd__clue-list--list").querySelectorAll(".xwd__clue--li").length || 0;

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

const clearPuzzle = (): void => {
	returnToStart();

	for (let x = 0; x < numOfCluesAcross; x++) {
		setTimeout(() => {
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
		}, 1);
	}
	setTimeout(returnToStart, 50);
};

const main = (): void => {
	enableAutocheck();
	fillPuzzle(["a", "b"]);

	setTimeout(() => {
		const popupButton = document.querySelector(".pz-moment__button");
		if (popupButton instanceof HTMLElement) {
			popupButton.click();
		}

		setTimeout(clearPuzzle, 250);
	}, 1000);
};

main();
