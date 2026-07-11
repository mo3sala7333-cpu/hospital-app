import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { company } from "../../data/company";
import { cairo } from "../../theme/fonts";
import { LogoReveal } from "../opening/LogoReveal";
import { MaskWipeText } from "../shared/MaskWipeText";

export const ClosingShot: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
	const frame = useCurrentFrame();

	const bgOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
	const tagOpacity = interpolate(frame, [110, 140], [0, 1], { extrapolateLeft: "clamp" });
	const fadeOut = interpolate(
		frame,
		[durationFrames - 55, durationFrames],
		[1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<AbsoluteFill style={{ background: colors.background, opacity: fadeOut }}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse at 50% 45%, rgba(15,118,110,0.22) 0%, ${colors.background} 70%)`,
					opacity: bgOpacity,
				}}
			/>
			<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
				<LogoReveal startFrame={6} />
				<div style={{ marginTop: 16 }}>
					<MaskWipeText text={company.nameAr} startFrame={30} fontSize={46} fontWeight={700} />
				</div>
				<div
					style={{
						marginTop: 16,
						opacity: tagOpacity,
						fontFamily: cairo,
						fontWeight: 400,
						fontSize: 18,
						letterSpacing: 6,
						textTransform: "uppercase",
						color: colors.accent,
					}}
				>
					{company.tagline}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
