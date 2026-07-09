import { deterministicRandom } from "../../lib/deterministicRandom";

export type GlowWindow = {
	x: number;
	y: number;
	w: number;
	h: number;
	warm: boolean;
	blink?: boolean;
	phase: number;
};

export type Building = {
	x: number;
	width: number;
	height: number;
	setback?: { width: number; height: number };
	antenna?: { height: number; blinkPhase: number };
	glowWindows: GlowWindow[];
	rimLight: boolean;
};

export type CityLayer = {
	buildings: Building[];
	spanWidth: number;
};

const rand = (seed: number) => deterministicRandom(seed);

export const generateCityLayer = (
	seed: number,
	count: number,
	minH: number,
	maxH: number,
	detail: "silhouette" | "sparse" | "detailed",
	widthScale = 1,
): CityLayer => {
	const buildings: Building[] = [];
	let cursor = 0;

	for (let i = 0; i < count; i++) {
		const s = seed + i * 13.7;
		const width = (90 + rand(s) * 150) * widthScale;
		const gap = (6 + rand(s + 0.5) * 46) * widthScale;
		const height = minH + rand(s + 1) * (maxH - minH);
		const x = cursor;
		cursor += width + gap;

		const hasSetback = rand(s + 2) > 0.55;
		const setback = hasSetback
			? {
					width: width * (0.45 + rand(s + 3) * 0.25),
					height: height * (0.2 + rand(s + 4) * 0.3),
				}
			: undefined;

		const hasAntenna = rand(s + 5) > 0.62;
		const antenna = hasAntenna
			? { height: 26 + rand(s + 6) * 46, blinkPhase: rand(s + 7) * Math.PI * 2 }
			: undefined;

		const glowWindows: GlowWindow[] = [];
		if (detail === "sparse") {
			const bands = 1 + Math.floor(rand(s + 8) * 3);
			for (let b = 0; b < bands; b++) {
				const bs = s + 9 + b * 3.3;
				glowWindows.push({
					x: width * (0.12 + rand(bs) * 0.5),
					y: height * (0.1 + rand(bs + 1) * 0.75),
					w: width * (0.3 + rand(bs + 2) * 0.35),
					h: 5 + rand(bs + 2.5) * 4,
					warm: rand(bs + 1.7) > 0.72,
					phase: 0,
				});
			}
		} else if (detail === "detailed") {
			const cols = Math.max(2, Math.floor(width / 30));
			const rows = Math.max(2, Math.floor(height / 36));
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const ws = s + 20 + r * 3.1 + c * 1.7;
					if (rand(ws) > 0.68) {
						const warm = rand(ws + 0.3) > 0.74;
						glowWindows.push({
							x: 10 + c * (width / cols),
							y: 14 + r * (height / rows),
							w: 6,
							h: 9,
							warm,
							blink: rand(ws + 0.6) > 0.93,
							phase: rand(ws + 0.9) * Math.PI * 2,
						});
					}
				}
			}
		}

		buildings.push({
			x,
			width,
			height,
			setback,
			antenna,
			glowWindows,
			rimLight: detail === "detailed" && rand(s + 30) > 0.5,
		});
	}

	return { buildings, spanWidth: cursor };
};
