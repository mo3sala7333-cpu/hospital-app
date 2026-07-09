import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cairo } from "../../theme/fonts";
import { colors } from "../../theme/colors";
import { company } from "../../data/company";

const REVEAL_FRAMES = 84; // ~1.4s at 60fps
const SOFT_EDGE = 7; // % width of the feathered sweep edge

export const TitleReveal: React.FC<{
	startFrame: number;
	orbitRotateY: number;
	orbitScale: number;
	opacity: number;
}> = ({ startFrame, orbitRotateY, orbitScale, opacity }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const localFrame = frame - startFrame;

	// A single spring drives the whole connected string — the Arabic text
	// is never split into individual letters, so shaping/ligatures stay
	// correct throughout the animation.
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

	const sweepOpacity = interpolate(
		reveal,
		[0, 0.06, 0.9, 1],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	const maskImage = `linear-gradient(90deg, transparent 0%, transparent ${leftEdge}%, black ${leftEdge + SOFT_EDGE}%, black 100%)`;

	const taglineStart = startFrame + REVEAL_FRAMES + 14;
	const taglineProgress = spring({
		frame: frame - taglineStart,
		fps,
		config: { damping: 200 },
	});

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				opacity,
				perspective: 1400,
			}}
		>
			<div
				style={{
					transform: `rotateY(${orbitRotateY}deg) scale(${orbitScale})`,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<div style={{ position: "relative" }}>
					<div
						dir="rtl"
						style={{
							fontFamily: cairo,
							fontWeight: 700,
							fontSize: 92,
							color: colors.text,
							letterSpacing: 2,
							textShadow: `0 0 40px rgba(212,175,55,0.35), 0 0 90px rgba(15,118,110,0.25)`,
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
						marginTop: 22,
						opacity: interpolate(taglineProgress, [0, 1], [0, 1]),
						transform: `translateY(${interpolate(taglineProgress, [0, 1], [10, 0])}px)`,
						fontFamily: cairo,
						fontWeight: 400,
						fontSize: 22,
						letterSpacing: 6,
						textTransform: "uppercase",
						color: colors.accent,
					}}
				>
					{company.tagline}
				</div>
			</div>
		</div>
	);
};
