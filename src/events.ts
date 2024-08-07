export const createKeyboardEvent = (type: string, options: KeyboardEventInit): KeyboardEvent =>
	new KeyboardEvent(type, options);

export const createMouseEvent = (type: string, options: MouseEventInit): MouseEvent => new MouseEvent(type, options);

export const tabEvent = createKeyboardEvent("keydown", {
	key: "Tab",
	code: "Tab",
	keyCode: 9,
	which: 9,
	bubbles: true,
	cancelable: true,
	composed: true,
});

export const deleteEvent = createKeyboardEvent("keydown", {
	key: "Backspace",
	code: "Backspace",
	keyCode: 8,
	which: 8,
	bubbles: true,
	cancelable: true,
	composed: true,
});

export const clickEvent = createMouseEvent("click", {
	bubbles: true,
	cancelable: true,
	view: window,
});

export const vowelCharCodes = [97, 101, 105, 111, 117, 121];
