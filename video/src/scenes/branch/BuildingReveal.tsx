import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { branchAssetPath } from "../../data/company";
import type { OperationalBranch } from "../../data/company";
import { KenBurnsImage } from "../shared/KenBurnsImage";
import { MaskWipeText } from "../shared/MaskWipeText";
import { AnimatedCounter } from "./AnimatedCounter";

export const BuildingReveal: React.FC<{
	branch: OperationalBranch;
	photoFile: string;
	nameStartFrame: number;
	counterStartFrame: number;
	counterDurationFrames: number;
	durationFrames: number;
	panSeed: number;
}> = ({ branch, photoFile, nameStartFrame, counterStartFrame, counterDurationFrames, durationFrames, panSeed }) => {
	const frame = useCurrentFrame();

	const photoOpacity = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });

	return (
		<AbsoluteFill style={{ background: colors.background, overflow: "hidden" }}>
			<div style={{ position: "absolute", inset: 0, opacity: photoOpacity }}>
				<KenBurnsImage
					src={branchAssetPath(branch.assetDir, "building", photoFile)}
					startFrame={0}
					durationFrames={durationFrames}
					panSeed={panSeed}
					fadeInFrames={1}
					fadeOutFrames={1}
					zoomFrom={1.0}
					zoomTo={1.1}
					grade="saturate(1.06) contrast(1.05) brightness(0.96)"
				/>
			</div>

			<AbsoluteFill
				style={{
					background:
						"linear-gradient(180deg, rgba(5,10,18,0.55) 0%, rgba(5,10,18,0.1) 30%, rgba(5,10,18,0.15) 60%, rgba(5,10,18,0.88) 100%)",
				}}
			/>

			<AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 90 }}>
				<AnimatedCounter
					value={branch.assets}
					startFrame={counterStartFrame}
					durationFrames={counterDurationFrames}
					label="إجمالي الأصول"
					fontSize={58}
				/>
			</AbsoluteFill>

			<AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 64 }}>
				<div
					style={{
						padding: "10px 34px",
						borderRadius: 999,
						background: "rgba(5,10,18,0.4)",
						backdropFilter: "blur(2px)",
					}}
				>
					<MaskWipeText text={branch.name} startFrame={nameStartFrame} fontSize={54} fontWeight={700} />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
