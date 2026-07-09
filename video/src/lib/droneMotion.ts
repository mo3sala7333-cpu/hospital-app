// Continuous, organic camera motion for the whole opening scene — a sum of
// out-of-phase sine waves at different periods reads as airborne drift
// rather than a single mechanical oscillation. Applied identically to every
// parallax layer (scaled by that layer's own depth factor) so the whole
// shot breathes together, the way a real drone shot would.
const wave = (frame: number, period: number, amplitude: number, phase: number) =>
	Math.sin((frame / period) * Math.PI * 2 + phase) * amplitude;

export type DroneMotion = {
	driftX: number; // px, slow horizontal wander
	bobY: number; // px, vertical "breathing"
	bankDeg: number; // subtle roll, sells banking turns
};

export const getDroneMotion = (frame: number): DroneMotion => {
	const driftX = wave(frame, 480, 30, 0) + wave(frame, 191, 11, 1.3) + wave(frame, 77, 4, 2.7);
	const bobY = wave(frame, 260, 8, 0.6) + wave(frame, 97, 3, 3.1);
	const bankDeg = wave(frame, 420, 1.4, 0.4) + wave(frame, 150, 0.5, 2.1);
	return { driftX, bobY, bankDeg };
};
