document.addEventListener("DOMContentLoaded", function () {
	const checkbox = document.getElementById("autocheck-toggle") as HTMLInputElement;
	checkbox.addEventListener("change", function () {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs: chrome.tabs.Tab[]) {
			if (tabs[0].id) {
				chrome.tabs.sendMessage(tabs[0].id, { autocheck: checkbox.checked });
			}
		});
	});
});
