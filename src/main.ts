import {
	tabEvent,
	deleteEvent,
	clickEvent,
	vowelCharCodes,
	createKeyboardEvent,
	returnToStart,
	rightArrowEvent,
} from "./events";

const enableAutocheck = (): void => {
	const autocheckButton = Array.from(document.querySelectorAll("button.xwd__menu--btnlink")).find(
		(button) => button.textContent?.trim() === "Autocheck"
	);

	if (autocheckButton && !autocheckButton.parentElement?.classList.contains("xwd__menu--item-checked")) {
		(autocheckButton as HTMLElement)?.click();
	}
};

const fillPuzzle = (): void => {
	returnToStart();
	for (let x = 0; x < 50; x++) {
		for (let i = 0; i < 6; i++) {
			for (let j = 0; j < 14; j++) {
				const highlightedCell = document.querySelector(".xwd__cell--highlighted");
				if (highlightedCell) {
					highlightedCell.dispatchEvent(
						createKeyboardEvent("keypress", {
							charCode: vowelCharCodes[i],
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
	for (let x = 0; x < 100; x++) {
		setTimeout(() => {
			const currSelectedLetters = document.querySelectorAll(".xwd__cell--highlighted");
			const lastElement = currSelectedLetters[currSelectedLetters.length - 1];
			const selectedCell = document.querySelector(".xwd__cell--selected");

			if (lastElement && selectedCell && lastElement.id !== selectedCell.id) {
				lastElement.dispatchEvent(clickEvent);
			}

			for (let i = 0; i < 15; i++) {
				lastElement?.dispatchEvent(deleteEvent);
			}
			document.activeElement?.dispatchEvent(tabEvent);
		}, 1);
	}
};

const clearPuzzle2 = (): void => {
	returnToStart();
	const acrossClueListWrapper = document.querySelector(".xwd__clue-list--list");
	const acrossCluesLength = acrossClueListWrapper.querySelectorAll(".xwd__clue--li").length;

	for (let i = 0; i < acrossCluesLength; i++) {
		const currSelectedLetters = document.querySelectorAll(".xwd__cell--highlighted");
		let selectedCell = document.querySelector(".xwd__cell--selected");

		while (selectedCell.id != currSelectedLetters[currSelectedLetters.length - 1].id) {
			selectedCell.dispatchEvent(rightArrowEvent);
			selectedCell = document.querySelector(".xwd__cell--selected");
		}

		while (selectedCell.id != currSelectedLetters[0].id) {
			selectedCell.dispatchEvent(deleteEvent);
			selectedCell = document.querySelector(".xwd__cell--selected");
		}
		document.activeElement?.dispatchEvent(tabEvent);
	}
};

const main = (): void => {
	enableAutocheck();
	fillPuzzle();

	setTimeout(() => {
		const popupButton = document.querySelector(".pz-moment__button");
		if (popupButton instanceof HTMLElement) {
			popupButton.click();
		}

		setTimeout(clearPuzzle2, 1000);
	}, 1000);
};

main();
