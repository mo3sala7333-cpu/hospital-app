import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { deterministicRandom } from "../../lib/deterministicRandom";

type Lane = {
	top: number; // %
	rotateDeg: number;
	speed: number; // px/frame
	color: string;
	glow: string;
	streakLength: number;
	count: number;
	direction: 1 | -1;
	seedOffset: number;
};

const LANES: Lane[] = [
	{ top: 93, rotateDeg: -1.2, speed: 5.2, color: "#fff2d6", glow: "#ffcf7a", streakLength: 52, count: 9, direction: 1, seedOffset: 0 },
	{ top: 96.5, rotateDeg: -1.2, speed: -4.1, color: "#ff6b57", glow: "#ff8a6b", streakLength: 40, count: 8, direction: -1, seedOffset: 30 },
	{ top: 86, rotateDeg: 5.5, speed: 3.4, color: "#fff2d6", glow: "#ffcf7a", streakLength: 46, count: 7, direction: 1, seedOffset: 60 },
	{ top: 88.5, rotateDeg: 5.5, speed: -3.9, color: "#ff6b57", glow: "#ff8a6b", streakLength: 38, count: 6, direction: -1, seedOffset: 90 },
];

const ROAD_WIDTH = 2400;

const LaneStreaks: React.FC<{ lane: Lane; frame: number }> = ({ lane, frame }) => {
	const items = useMemo(
		() =>
			Array.from({ length: lane.count }).map((_, i) => ({
				baseX: deterministicRandom(lane.seedOffset + i * 3.3) * ROAD_WIDTH,
			})),
		[lane],
	);

	return (
		<div
			style={{
				position: "absolute",
				left: "50%",
				top: `${lane.top}%`,
				width: ROAD_WIDTH,
				height: 3,
				transform: `translateX(-50%) rotate(${lane.rotateDeg}deg)`,
			}}
		>
			{items.map((item, i) => {
				const x = ((item.baseX + frame * lane.speed) % ROAD_WIDTH + ROAD_WIDTH) % ROAD_WIDTH;
				return (
					<div
						key={i}
						style={{
							position: "absolute",
							left: x,
							top: 0,
							width: lane.streakLength,
							height: 3,
							borderRadius: 2,
							background: `linear-gradient(${lane.direction === 1 ? "90deg" : "270deg"}, ${lane.color} 0%, ${lane.glow} 55%, rgba(255,255,255,0) 100%)`,
							boxShadow: `0 0 8px 1px ${lane.glow}`,
							opacity: 0.9,
						}}
					/>
				);
			})}
		</div>
	);
};

// A foreground street / freeway-interchange sliver at the base of the
// skyline, with continuously flowing light-trail streaks (warm headlights
// one way, red taillights the other) — the "living city at night" cue.
export const RoadLights: React.FC<{ translateX: number; scale: number; opacity: number }> = ({
	translateX,
	scale,
	opacity,
}) => {
	const frame = useCurrentFrame();

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				overflow: "hidden",
				opacity,
				transform: `translateX(${translateX}px) scale(${scale})`,
				transformOrigin: "50% 100%",
			}}
		>
			{LANES.map((lane, i) => (
				<LaneStreaks key={i} lane={lane} frame={frame} />
			))}
		</div>
	);
};
