import { sendMessageToActiveTab, saveState } from "./dataFlow";
import { showFeedback } from "./feedback";

export function handleWrapperClick(e: MouseEvent) {
	if (!(e.target as HTMLElement).classList.contains("letter-input")) {
		const emptyInput = Array.from(document.querySelectorAll<HTMLInputElement>(".letter-input")).find(
			(input) => !input.value
		);
		emptyInput?.focus();
	}
}

export function handleInput(e: Event, index: number) {
	const input = e.target as HTMLInputElement;
	if (input.value) {
		input.value = input.value.slice(-1).toUpperCase(); // Keep only the last entered character
		focusNextInput(index);
	}
}

export function handleKeydown(e: KeyboardEvent, index: number) {
	const input = e.target as HTMLInputElement;
	if (e.key === "Backspace" && input.value === "") {
		e.preventDefault();
		focusPreviousInput(index, true);
	} else if (e.key === "ArrowLeft") {
		e.preventDefault();
		focusPreviousInput(index, false);
	} else if (e.key === "ArrowRight") {
		e.preventDefault();
		focusNextInput(index);
	} else if (/^[a-zA-Z]$/.test(e.key)) {
		e.preventDefault();
		input.value = e.key.toUpperCase();
		focusNextInput(index);
	}
	saveState();
}

function focusNextInput(currentIndex: number) {
	const nextInput = document.querySelector<HTMLInputElement>(`.letter-input:nth-child(${currentIndex + 2})`);
	nextInput?.focus();
}

function focusPreviousInput(currentIndex: number, erase: boolean) {
	if (currentIndex > 0) {
		const prevInput = document.querySelector<HTMLInputElement>(`.letter-input:nth-child(${currentIndex})`);
		if (prevInput) {
			prevInput.focus();
			if (erase) {
				prevInput.value = "";
			}
		}
	}
}

export async function handleReveal() {
	const letters = Array.from(document.querySelectorAll<HTMLInputElement>(".letter-input"))
		.filter((input) => input.value)
		.map((input) => input.value);
	const autocheckOn = (document.getElementById("autocheck-toggle") as HTMLInputElement).checked;

	if (letters.length == 0) {
		showFeedback("Letters to reveal must not be empty.", "error");
		return;
	}

	showFeedback("Working magic...", "working");

	try {
		const response = await sendMessageToActiveTab({
			action: "runCrosswordHelper",
			letters: letters,
			autocheck: autocheckOn,
		});
		if (response && response.success) {
			showFeedback("Letters revealed successfully!", "success");
		} else {
			showFeedback("Failed to reveal letters. Please try again.", "error");
		}
	} catch (error) {
		console.error(error);
		showFeedback(`An error occurred: ${error instanceof Error ? error.message : JSON.stringify(error)}`, "error");
	}
}