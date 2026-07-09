// All values in frames, assuming the composition's fps (60).
export const OPENING = {
	fps: 60,
	flyInEnd: 8 * 60, // city settles into frame
	titleStart: 4 * 60, // title begins its mask-wipe reveal, overlapping the tail of the fly-in
	holdEnd: 14 * 60, // title sits steady
	orbitEnd: 19 * 60, // camera orbits around the floating title
	diveEnd: 23 * 60, // dive down into the city, ends on a flash-cut
};

export const OPENING_DURATION = OPENING.diveEnd;
