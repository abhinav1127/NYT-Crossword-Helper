import { SELECTORS } from "./constants";

export function showFeedback(message: string, state: "working" | "success" | "error") {
	const feedback = document.getElementById(SELECTORS.FEEDBACK);
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
