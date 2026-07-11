import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { MaskWipeText } from "../shared/MaskWipeText";

// A glowing pulse tracing a route between two nodes on an abstract dark
// "map" — the connective tissue between branch chapters.
export const GlowPathTransition: React.FC<{
	fromName: string;
	toName: string;
	durationFrames: number;
}> = ({ fromName, toName, durationFrames }) => {
	const frame = useCurrentFrame();

	const leftX = 26;
	const rightX = 74;
	const y = 50;

	const travel = interpolate(frame, [10, durationFrames - 30], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.inOut(Easing.cubic),
	});
	const pulseX = interpolate(travel, [0, 1], [leftX, rightX]);

	const sceneOpacity = interpolate(
		frame,
		[0, 20, durationFrames - 20, durationFrames],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	const fromOpacity = interpolate(travel, [0, 0.35], [1, 0.25], { extrapolateRight: "clamp" });
	const toOpacity = interpolate(travel, [0.65, 1], [0.25, 1], { extrapolateLeft: "clamp" });
	const toGlow = interpolate(travel, [0.85, 1], [0, 1], { extrapolateLeft: "clamp" });

	return (
		<AbsoluteFill style={{ background: colors.background, opacity: sceneOpacity }}>
			<svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
				<line
					x1={`${leftX}%`}
					y1={`${y}%`}
					x2={`${rightX}%`}
					y2={`${y}%`}
					stroke={colors.secondary}
					strokeWidth={1.5}
					strokeDasharray="2 10"
					opacity={0.35}
				/>
				<line
					x1={`${leftX}%`}
					y1={`${y}%`}
					x2={`${pulseX}%`}
					y2={`${y}%`}
					stroke={colors.accent}
					strokeWidth={2}
					opacity={0.8}
					style={{ filter: "blur(1px)" }}
				/>
				<circle cx={`${leftX}%`} cy={`${y}%`} r={7} fill={colors.accent} opacity={fromOpacity} />
				<circle
					cx={`${rightX}%`}
					cy={`${y}%`}
					r={7}
					fill={colors.accent}
					opacity={Math.max(toOpacity, toGlow)}
				/>
				<circle
					cx={`${rightX}%`}
					cy={`${y}%`}
					r={22}
					fill="none"
					stroke={colors.accent}
					strokeWidth={2}
					opacity={toGlow * 0.6}
				/>
				<circle
					cx={`${pulseX}%`}
					cy={`${y}%`}
					r={10}
					fill="rgba(255,244,214,0.95)"
					style={{ filter: "blur(3px)" }}
				/>
			</svg>

			<div style={{ position: "absolute", left: `${leftX}%`, top: `${y}%`, transform: "translate(-50%, 40px)" }}>
				<div style={{ opacity: fromOpacity }}>
					<MaskWipeText text={fromName} startFrame={0} fontSize={30} fontWeight={600} revealFrames={1} glow={false} />
				</div>
			</div>
			<div style={{ position: "absolute", left: `${rightX}%`, top: `${y}%`, transform: "translate(-50%, 40px)" }}>
				<div style={{ opacity: toOpacity }}>
					<MaskWipeText text={toName} startFrame={durationFrames - 45} fontSize={30} fontWeight={700} revealFrames={30} />
				</div>
			</div>
		</AbsoluteFill>
	);
};
