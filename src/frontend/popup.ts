import { handleInput, handleKeydown, handleWrapperClick, handleReveal } from "./handlers";
import { loadSavedState, saveState, sendMessageToActiveTab } from "./dataFlow";
import { SELECTORS, VALID_INPUT_REGEX } from "./constants";

document.addEventListener("DOMContentLoaded", function () {
	const checkbox = document.getElementById(SELECTORS.AUTOCHECK_TOGGLE) as HTMLInputElement;
	const letterInputs = document.querySelectorAll<HTMLInputElement>(SELECTORS.LETTER_INPUT);
	const revealButton = document.getElementById(SELECTORS.REVEAL_BUTTON) as HTMLButtonElement;
	const wrapper = document.getElementById(SELECTORS.LETTER_INPUT_WRAPPER);
	wrapper?.addEventListener("click", handleWrapperClick);

	// Load saved state
	loadSavedState();

	checkbox.addEventListener("change", function () {
		sendMessageToActiveTab({ action: "toggleAutocheck", autocheck: checkbox.checked });
		saveState();
	});

	letterInputs.forEach((input, index) => {
		input.addEventListener("input", (e) => {
			handleInput(e, index);
			saveState();
		});
		input.addEventListener("keydown", (e) => handleKeydown(e, index));
		input.addEventListener("beforeinput", (e) => {
			const inputChar = e.data;
			if (inputChar && !VALID_INPUT_REGEX.test(inputChar)) {
				e.preventDefault();
			}
		});
		input.addEventListener("focus", (e) => {
			const input = e.target as HTMLInputElement;
			input.select(); // Select all text when focused
		});
		input.addEventListener("click", (e) => {
			const input = e.target as HTMLInputElement;
			input.select(); // Select all text when clicked
		});
		input.addEventListener("keydown", (e) => {
			handleKeydown(e, index);
			if (e.key === "Enter") {
				e.preventDefault();
				handleReveal();
			}
		});
	});

	revealButton.addEventListener("click", handleReveal);
});
