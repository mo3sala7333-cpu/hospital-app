import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cairo } from "../../theme/fonts";
import { colors } from "../../theme/colors";
import { company } from "../../data/company";

const REVEAL_FRAMES = 84; // ~1.4s at 60fps
const SOFT_EDGE = 7; // % width of the feathered sweep edge

// The Arabic title is rendered as a single connected string at all times —
// it is never split into per-letter elements, which would break cursive
// joining/shaping. The reveal is a right-to-left mask sweep instead.
export const TitleReveal: React.FC<{ startFrame: number }> = ({ startFrame }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const localFrame = frame - startFrame;

	const reveal = interpolate(localFrame, [0, REVEAL_FRAMES], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const settle = spring({
		frame: localFrame - REVEAL_FRAMES * 0.5,
		fps,
		config: { damping: 200, mass: 0.7, stiffness: 90 },
	});

	const leftEdge = interpolate(reveal, [0, 1], [100, -SOFT_EDGE]);
	const blur = interpolate(settle, [0, 1], [16, 0]);
	const scaleIn = interpolate(settle, [0, 1], [0.94, 1]);
	const fadeIn = interpolate(reveal, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });

	const sweepOpacity = interpolate(reveal, [0, 0.06, 0.9, 1], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const maskImage = `linear-gradient(90deg, transparent 0%, transparent ${leftEdge}%, black ${leftEdge + SOFT_EDGE}%, black 100%)`;

	const taglineStart = startFrame + REVEAL_FRAMES + 14;
	const taglineProgress = spring({
		frame: frame - taglineStart,
		fps,
		config: { damping: 200 },
	});

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<div style={{ position: "relative" }}>
				<div
					dir="rtl"
					style={{
						fontFamily: cairo,
						fontWeight: 700,
						fontSize: 80,
						color: colors.text,
						letterSpacing: 2,
						textShadow: `0 2px 18px rgba(0,0,0,0.65), 0 0 40px rgba(212,175,55,0.3)`,
						whiteSpace: "nowrap",
						opacity: fadeIn,
						filter: `blur(${blur}px)`,
						transform: `scale(${scaleIn})`,
						WebkitMaskImage: maskImage,
						maskImage,
					}}
				>
					{company.introTitle}
				</div>
				<div
					style={{
						position: "absolute",
						top: -20,
						bottom: -20,
						left: `${leftEdge + SOFT_EDGE}%`,
						width: 54,
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
			<div
				style={{
					marginTop: 18,
					opacity: interpolate(taglineProgress, [0, 1], [0, 1]),
					transform: `translateY(${interpolate(taglineProgress, [0, 1], [10, 0])}px)`,
					fontFamily: cairo,
					fontWeight: 400,
					fontSize: 19,
					letterSpacing: 6,
					textTransform: "uppercase",
					color: colors.accent,
					textShadow: "0 2px 10px rgba(0,0,0,0.6)",
				}}
			>
				{company.tagline}
			</div>
		</div>
	);
};
