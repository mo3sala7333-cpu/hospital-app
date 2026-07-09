import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../theme/colors";

export const LogoReveal: React.FC<{ startFrame: number }> = ({ startFrame }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const progress = spring({
		frame: frame - startFrame,
		fps,
		config: { damping: 200, mass: 0.8, stiffness: 90 },
	});

	const opacity = interpolate(progress, [0, 1], [0, 1]);
	const scale = interpolate(progress, [0, 1], [0.82, 1]);
	const bloomOpacity = interpolate(progress, [0, 0.6, 1], [0, 0.9, 0.55]);

	return (
		<div
			style={{
				position: "relative",
				width: 190,
				height: 190,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					position: "absolute",
					width: 420,
					height: 420,
					borderRadius: "50%",
					background: `radial-gradient(circle, rgba(255,244,214,0.55) 0%, rgba(212,175,55,0.22) 42%, rgba(212,175,55,0) 72%)`,
					opacity: bloomOpacity,
					filter: "blur(4px)",
				}}
			/>
			<Img
				src={staticFile("generated/logo-alpha.png")}
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					objectFit: "contain",
					opacity,
					transform: `scale(${scale})`,
					filter: `drop-shadow(0 6px 26px rgba(0,0,0,0.55)) drop-shadow(0 0 30px rgba(212,175,55,0.25))`,
				}}
			/>
		</div>
	);
};

// Exported for reuse: the soft dark scrim that keeps the logo+title block
// readable over moving footage, without reading as a hard UI panel.
export const ReadabilityScrim: React.FC<{ opacity: number }> = ({ opacity }) => (
	<div
		style={{
			position: "absolute",
			left: "50%",
			top: "50%",
			width: 1400,
			height: 620,
			transform: "translate(-50%, -50%)",
			background: `radial-gradient(ellipse, ${colors.background} 0%, rgba(5,10,18,0.55) 45%, rgba(5,10,18,0) 72%)`,
			opacity,
			pointerEvents: "none",
		}}
	/>
);
