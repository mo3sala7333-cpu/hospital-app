import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cairo } from "../../theme/fonts";
import { colors } from "../../theme/colors";
import { company } from "../../data/company";

const STAGGER = 2.4; // frames between each character's reveal start

const Character: React.FC<{ char: string; index: number; startFrame: number }> = ({
	char,
	index,
	startFrame,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const localFrame = frame - startFrame - index * STAGGER;

	const progress = spring({
		frame: localFrame,
		fps,
		config: { damping: 200, mass: 0.6, stiffness: 120 },
	});

	const opacity = interpolate(progress, [0, 1], [0, 1]);
	const translateY = interpolate(progress, [0, 1], [22, 0]);
	const blur = interpolate(progress, [0, 1], [10, 0]);

	if (char === " ") {
		return <span style={{ display: "inline-block", width: "0.35em" }}> </span>;
	}

	return (
		<span
			style={{
				display: "inline-block",
				opacity,
				transform: `translateY(${translateY}px)`,
				filter: `blur(${blur}px)`,
			}}
		>
			{char}
		</span>
	);
};

export const TitleReveal: React.FC<{
	startFrame: number;
	orbitRotateY: number;
	orbitScale: number;
	opacity: number;
}> = ({ startFrame, orbitRotateY, orbitScale, opacity }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const chars = Array.from(company.introTitle);

	const taglineStart = startFrame + chars.length * STAGGER + 10;
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
					transformStyle: "preserve-3d",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
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
					}}
				>
					{chars.map((c, i) => (
						<Character key={i} char={c} index={i} startFrame={startFrame} />
					))}
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
