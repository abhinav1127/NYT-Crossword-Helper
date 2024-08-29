document.addEventListener("DOMContentLoaded", function () {
	const checkbox = document.getElementById("autocheck-toggle") as HTMLInputElement;
	const letterInputs = document.querySelectorAll<HTMLInputElement>(".letter-input");
	const revealButton = document.getElementById("reveal-button") as HTMLButtonElement;
	const wrapper = document.getElementById("letter-input-wrapper");
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

async function handleReveal() {
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

function sendMessageToActiveTab(message: any): Promise<any> {
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

function showFeedback(message: string, state: "working" | "success" | "error") {
	const feedback = document.getElementById("feedback");
	if (feedback) {
		let emoji = "";
		switch (state) {
			case "working":
				emoji = "🪄";
				message = "Working magic"; // Remove dots from the message
				break;
			case "success":
				emoji = "✅";
				break;
			case "error":
				emoji = "❌";
				break;
		}

		feedback.innerHTML = `<span class="emoji">${emoji}</span> ${message}`;
		if (state === "working") {
			feedback.innerHTML += '<span class="dots"><span>.</span><span>.</span><span>.</span></span>';
		}
		feedback.className = state;
		feedback.style.display = "block";

		if (state !== "working") {
			setTimeout(() => {
				feedback.style.display = "none";
			}, 3000);
		}
	}
}

function saveState() {
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

function loadSavedState() {
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
			firstEmptyInput?.focus();
		});
	} else {
		console.error("Chrome storage API is not available");
	}
}
