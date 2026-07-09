// All values in frames, assuming the composition's fps (60).
export const OPENING = {
	fps: 60,
	establishEnd: 2 * 60, // the city plays alone first, cinematic breathing room
	logoStart: 2 * 60,
	titleStart: 4 * 60, // overlaps the tail of the logo reveal
	holdStart: 8 * 60,
	transitionStart: 13 * 60, // dive/accelerate into the flash-cut
	diveEnd: 16 * 60,
};

export const OPENING_DURATION = OPENING.diveEnd;
