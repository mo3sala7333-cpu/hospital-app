// A seeded, deterministic pseudo-random generator. Remotion renders each
// frame independently (possibly out of order, possibly on different
// machines), so Math.random() would cause flicker/inconsistency between
// frames. This hashes a seed into a stable [0, 1) value instead.
export const deterministicRandom = (seed: number): number => {
	const x = Math.sin(seed * 12.9898) * 43758.5453;
	return x - Math.floor(x);
};
