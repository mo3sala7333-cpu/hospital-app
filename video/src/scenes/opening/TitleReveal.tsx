import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cairo } from "../../theme/fonts";
import { colors } from "../../theme/colors";
import { company } from "../../data/company";
import { MaskWipeText } from "../shared/MaskWipeText";

const REVEAL_FRAMES = 84; // ~1.4s at 60fps

export const TitleReveal: React.FC<{ startFrame: number }> = ({ startFrame }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const taglineStart = startFrame + REVEAL_FRAMES + 14;
	const taglineProgress = spring({
		frame: frame - taglineStart,
		fps,
		config: { damping: 200 },
	});

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<MaskWipeText
				text={company.introTitle}
				startFrame={startFrame}
				fontSize={80}
				fontWeight={700}
				revealFrames={REVEAL_FRAMES}
			/>
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
