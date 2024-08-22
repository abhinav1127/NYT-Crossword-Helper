document.addEventListener("DOMContentLoaded", function () {
	const checkbox = document.getElementById("autocheck-toggle") as HTMLInputElement;
	const letterInputs = document.querySelectorAll<HTMLInputElement>(".letter-input");
	const revealButton = document.getElementById("reveal-button") as HTMLButtonElement;
	const wrapper = document.getElementById("letter-input-wrapper");
	wrapper?.addEventListener("click", handleWrapperClick);

	checkbox.addEventListener("change", function () {
		sendMessageToActiveTab({ action: "toggleAutocheck", autocheck: checkbox.checked });
	});

	letterInputs.forEach((input, index) => {
		input.addEventListener("input", (e) => handleInput(e, index));
		input.addEventListener("keydown", (e) => handleKeydown(e, index));
	});

	revealButton.addEventListener("click", handleReveal);
});

function handleWrapperClick(e: MouseEvent) {
	if (!(e.target as HTMLElement).classList.contains("letter-input")) {
		const emptyInput = Array.from(document.querySelectorAll<HTMLInputElement>(".letter-input")).find(
			(input) => !input.value
		);
		emptyInput?.focus();
	}
}

function handleInput(e: Event, index: number) {
	const input = e.target as HTMLInputElement;
	if (input.value) {
		focusNextInput(index);
	}
}

function handleKeydown(e: KeyboardEvent, index: number) {
	if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "") {
		focusPreviousInput(index);
	}
}

function focusNextInput(currentIndex: number) {
	const nextInput = document.querySelector<HTMLInputElement>(`.letter-input:nth-child(${currentIndex + 2})`);
	nextInput?.focus();
}

function focusPreviousInput(currentIndex: number) {
	if (currentIndex > 0) {
		const prevInput = document.querySelector<HTMLInputElement>(`.letter-input:nth-child(${currentIndex})`);
		if (prevInput) {
			prevInput.value = "";
			prevInput.focus();
		}
	}
}

function handleReveal() {
	const letters = Array.from(document.querySelectorAll<HTMLInputElement>(".letter-input"))
		.map((input) => input.value.toUpperCase())
		.join("");
	const autocheckOn = (document.getElementById("autocheck-toggle") as HTMLInputElement).checked;

	sendMessageToActiveTab({ action: "runCrosswordHelper", letters: letters, autocheck: autocheckOn });
}

function sendMessageToActiveTab(message: any) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (tabs[0]?.id) {
			chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
				if (chrome.runtime.lastError) {
					console.error("Error sending message:", chrome.runtime.lastError.message);
					// Optionally, display an error message to the user
				}
			});
		} else {
			console.error("No active tab found");
			// Optionally, display an error message to the user
		}
	});
}
