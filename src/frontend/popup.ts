document.addEventListener("DOMContentLoaded", function () {
	const checkbox = document.getElementById("autocheck-toggle") as HTMLInputElement;
	const letterInputs = document.querySelectorAll<HTMLInputElement>(".letter-input");
	const revealButton = document.getElementById("reveal-button") as HTMLButtonElement;
	const wrapper = document.getElementById("letter-input-wrapper");
	wrapper?.addEventListener("click", handleWrapperClick);

	checkbox.addEventListener("change", function () {
		sendMessageToActiveTab({ action: "toggleAutocheck", autocheck: checkbox.checked });
	});

	// TODO: Focus on last letter of saved input
	letterInputs[0].focus();
	letterInputs.forEach((input, index) => {
		input.addEventListener("input", (e) => handleInput(e, index));
		input.addEventListener("keydown", (e) => handleKeydown(e, index));
		input.addEventListener("beforeinput", (e) => {
			const inputChar = e.data;
			if (inputChar && !/^[a-zA-Z]$/.test(inputChar)) {
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
	});

	// TODO: implement failure
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
		input.value = input.value.slice(-1).toUpperCase(); // Keep only the last entered character
		focusNextInput(index);
	}
}

function handleKeydown(e: KeyboardEvent, index: number) {
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

function handleReveal() {
	const letters = Array.from(document.querySelectorAll<HTMLInputElement>(".letter-input"))
		.map((input) => input.value.toUpperCase())
		.join("");
	const autocheckOn = (document.getElementById("autocheck-toggle") as HTMLInputElement).checked;

	sendMessageToActiveTab({ action: "runCrosswordHelper", letters: letters, autocheck: autocheckOn });

	showFeedback("Letters revealed successfully!", true);
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

function showFeedback(message: string, isSuccess: boolean) {
	const feedback = document.getElementById("feedback");
	if (feedback) {
		feedback.textContent = message;
		feedback.className = isSuccess ? "success" : "error";
		feedback.style.display = "block";
		setTimeout(() => {
			feedback.style.display = "none";
		}, 3000);
	}
}
