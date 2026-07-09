import React, { useMemo } from "react";
import { colors } from "../../theme/colors";
import { deterministicRandom } from "../../lib/deterministicRandom";

type Building = {
	left: number; // percentage across the layer's width
	width: number; // px
	height: number; // px
	litWindows: number[]; // window indices that glow warm (vs teal)
};

const buildLayer = (seedBase: number, count: number, minH: number, maxH: number): Building[] => {
	const buildings: Building[] = [];
	for (let i = 0; i < count; i++) {
		const seed = seedBase + i * 7.31;
		const height = minH + deterministicRandom(seed) * (maxH - minH);
		const width = 60 + deterministicRandom(seed + 1) * 90;
		const left = (i / count) * 100 + (deterministicRandom(seed + 2) - 0.5) * (100 / count) * 0.6;
		const windowCount = Math.floor(height / 22);
		const litWindows: number[] = [];
		for (let w = 0; w < windowCount; w++) {
			if (deterministicRandom(seed + 10 + w) > 0.45) {
				litWindows.push(w);
			}
		}
		buildings.push({ left, width, height, litWindows });
	}
	return buildings;
};

const BuildingShape: React.FC<{
	building: Building;
	baseColor: string;
	windowWarm: string;
	windowCool: string;
	glowOpacity: number;
}> = ({ building, baseColor, windowWarm, windowCool, glowOpacity }) => {
	const rows = Math.max(1, Math.floor(building.height / 22));
	return (
		<div
			style={{
				position: "absolute",
				left: `${building.left}%`,
				bottom: 0,
				width: building.width,
				height: building.height,
				background: baseColor,
				boxShadow: `0 0 ${40 * glowOpacity}px rgba(212,175,55,${0.08 * glowOpacity})`,
				display: "flex",
				flexDirection: "column-reverse",
				alignItems: "center",
				paddingTop: 6,
				gap: 4,
			}}
		>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div key={rowIndex} style={{ display: "flex", gap: 4 }}>
					{Array.from({ length: 2 }).map((_, colIndex) => {
						const winIndex = rowIndex * 2 + colIndex;
						const lit = building.litWindows.includes(winIndex);
						const warm = winIndex % 5 === 0;
						return (
							<div
								key={colIndex}
								style={{
									width: 6,
									height: 9,
									background: lit ? (warm ? windowWarm : windowCool) : "rgba(255,255,255,0.03)",
									boxShadow: lit
										? `0 0 ${6 * glowOpacity}px ${warm ? windowWarm : windowCool}`
										: "none",
									opacity: lit ? glowOpacity : 1,
								}}
							/>
						);
					})}
				</div>
			))}
		</div>
	);
};

export const CitySkyline: React.FC<{
	// px, positive pushes the skyline down/away; used for the drone flight + dive.
	translateY: number;
	translateX: number;
	scale: number;
	parallax: number; // 0..1, how strongly this layer reacts to translateX/Y
	layer: "far" | "mid" | "near";
	glowOpacity: number;
}> = ({ translateY, translateX, scale, parallax, layer, glowOpacity }) => {
	const config = useMemo(() => {
		if (layer === "far") {
			return { seed: 1, count: 14, minH: 90, maxH: 220, color: "#0c2036", bottom: "38%" };
		}
		if (layer === "mid") {
			return { seed: 50, count: 11, minH: 140, maxH: 340, color: "#0e2a44", bottom: "20%" };
		}
		return { seed: 120, count: 8, minH: 220, maxH: 480, color: "#122f4e", bottom: "0%" };
	}, [layer]);

	const buildings = useMemo(
		() => buildLayer(config.seed, config.count, config.minH, config.maxH),
		[config],
	);

	return (
		<div
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				bottom: config.bottom,
				height: config.maxH + 40,
				transform: `translate(${translateX * parallax}px, ${translateY * parallax}px) scale(${scale})`,
				transformOrigin: "50% 100%",
			}}
		>
			{buildings.map((b, i) => (
				<BuildingShape
					key={i}
					building={b}
					baseColor={config.color}
					windowWarm={colors.accent}
					windowCool="#7fd9cf"
					glowOpacity={glowOpacity}
				/>
			))}
		</div>
	);
};
