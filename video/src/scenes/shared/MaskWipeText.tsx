import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cairo } from "../../theme/fonts";
import { colors } from "../../theme/colors";

// Reveals Arabic (or any) text as a single connected string via a
// right-to-left mask sweep — never split into per-letter elements, which
// would break cursive joining/shaping.
export const MaskWipeText: React.FC<{
	text: string;
	startFrame: number;
	fontSize: number;
	fontWeight?: number;
	color?: string;
	revealFrames?: number;
	rtl?: boolean;
	glow?: boolean;
}> = ({
	text,
	startFrame,
	fontSize,
	fontWeight = 700,
	color = colors.text,
	revealFrames = 60,
	rtl = true,
	glow = true,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const localFrame = frame - startFrame;
	const softEdge = 7;

	const reveal = interpolate(localFrame, [0, revealFrames], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const settle = spring({
		frame: localFrame - revealFrames * 0.5,
		fps,
		config: { damping: 200, mass: 0.7, stiffness: 90 },
	});

	const leftEdge = interpolate(reveal, [0, 1], [100, -softEdge]);
	const blur = interpolate(settle, [0, 1], [12, 0]);
	const scaleIn = interpolate(settle, [0, 1], [0.95, 1]);
	const fadeIn = interpolate(reveal, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
	const sweepOpacity = interpolate(reveal, [0, 0.06, 0.9, 1], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const maskImage = `linear-gradient(90deg, transparent 0%, transparent ${leftEdge}%, black ${leftEdge + softEdge}%, black 100%)`;

	return (
		<div style={{ position: "relative", display: "inline-block" }}>
			<div
				dir={rtl ? "rtl" : "ltr"}
				style={{
					fontFamily: cairo,
					fontWeight,
					fontSize,
					color,
					whiteSpace: "nowrap",
					opacity: fadeIn,
					filter: `blur(${blur}px)`,
					transform: `scale(${scaleIn})`,
					textShadow: glow
						? "0 2px 18px rgba(0,0,0,0.65), 0 0 34px rgba(212,175,55,0.28)"
						: undefined,
					WebkitMaskImage: maskImage,
					maskImage,
				}}
			>
				{text}
			</div>
			<div
				style={{
					position: "absolute",
					top: -16,
					bottom: -16,
					left: `${leftEdge + softEdge}%`,
					width: Math.max(28, fontSize * 0.5),
					transform: "translateX(-50%)",
					background:
						"linear-gradient(90deg, rgba(232,168,87,0) 0%, rgba(255,244,214,0.9) 50%, rgba(232,168,87,0) 100%)",
					opacity: sweepOpacity,
					filter: "blur(6px)",
					mixBlendMode: "screen",
					pointerEvents: "none",
				}}
			/>
		</div>
	);
};
