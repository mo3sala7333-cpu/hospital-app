import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { cairo } from "../../theme/fonts";
import { colors } from "../../theme/colors";
import { formatEGP } from "../../theme/formatCurrency";

// Counts up (never overshoots — Easing.out reads as a confident, decisive
// number landing, which matters for a board audience) and locks in with a
// small settle-pulse on arrival.
export const AnimatedCounter: React.FC<{
	value: number;
	startFrame: number;
	durationFrames: number;
	label: string;
	fontSize?: number;
}> = ({ value, startFrame, durationFrames, label, fontSize = 64 }) => {
	const frame = useCurrentFrame();
	const local = frame - startFrame;

	const progress = interpolate(local, [0, durationFrames], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const current = value * progress;

	const settlePulse = interpolate(
		local,
		[durationFrames - 1, durationFrames + 8, durationFrames + 20],
		[1, 1.06, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	const opacity = interpolate(local, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				opacity,
				transform: `scale(${settlePulse})`,
			}}
		>
			<div
				style={{
					fontFamily: cairo,
					fontWeight: 900,
					fontSize,
					color: colors.text,
					letterSpacing: 1,
					textShadow: "0 2px 20px rgba(0,0,0,0.6), 0 0 34px rgba(212,175,55,0.35)",
					fontVariantNumeric: "tabular-nums",
				}}
			>
				{formatEGP(current)}
			</div>
			<div
				dir="rtl"
				style={{
					marginTop: 6,
					fontFamily: cairo,
					fontWeight: 600,
					fontSize: fontSize * 0.28,
					color: colors.accent,
					letterSpacing: 2,
				}}
			>
				{label}
			</div>
		</div>
	);
};
