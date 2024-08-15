document.addEventListener("DOMContentLoaded", function () {
	const checkbox = document.getElementById("autocheck-toggle") as HTMLInputElement;
	const submitButton = document.getElementById("submit-button") as HTMLButtonElement;

	checkbox.addEventListener("change", function () {
		sendMessageToActiveTab({ action: "toggleAutocheck", autocheck: checkbox.checked });
	});

	submitButton.addEventListener("click", function () {
		sendMessageToActiveTab({ action: "runCrosswordHelper" });
	});
});

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
