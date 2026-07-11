import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { finaleAssets, finaleBranch, branchAssetPath } from "../../data/company";
import { AnimatedCounter } from "../branch/AnimatedCounter";
import { KenBurnsImage } from "../shared/KenBurnsImage";
import { MaskWipeText } from "../shared/MaskWipeText";
import { ParticleBurst } from "./ParticleBurst";

export const NewBuildingHero: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
	const frame = useCurrentFrame();
	const overlap = 30;
	const slice = Math.floor((durationFrames + overlap) / 2);

	const badgeOpacity = interpolate(frame, [40, 66], [0, 1], { extrapolateLeft: "clamp" });

	return (
		<AbsoluteFill style={{ background: colors.background, overflow: "hidden" }}>
			{finaleAssets.current.map((file, i) => (
				<KenBurnsImage
					key={file}
					src={branchAssetPath(finaleBranch.assetDir, "current", file)}
					startFrame={i * (slice - overlap)}
					durationFrames={slice}
					panSeed={200 + i * 6}
					fadeInFrames={overlap}
					fadeOutFrames={overlap}
					zoomFrom={1.06}
					zoomTo={1.22}
					grade="saturate(1.05) contrast(1.08) brightness(0.94)"
				/>
			))}

			<ParticleBurst startFrame={20} opacity={0.7} />

			<AbsoluteFill
				style={{
					background:
						"linear-gradient(180deg, rgba(5,10,18,0.6) 0%, rgba(5,10,18,0.05) 34%, rgba(5,10,18,0.1) 62%, rgba(5,10,18,0.9) 100%)",
				}}
			/>

			<AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 70, gap: 14 }}>
				<MaskWipeText text={finaleBranch.name} startFrame={10} fontSize={72} fontWeight={900} />
				<div
					dir="rtl"
					style={{
						opacity: badgeOpacity,
						padding: "8px 26px",
						borderRadius: 999,
						background: "rgba(212,175,55,0.14)",
						border: `1px solid ${colors.accent}`,
						color: colors.accent,
						fontFamily: "Cairo",
						fontWeight: 700,
						fontSize: 22,
						letterSpacing: 1,
					}}
				>
					قيد الإنشاء · نسبة الإنجاز {finaleBranch.constructionState === "50% Finished" ? "٥٠٪" : finaleBranch.constructionState}
				</div>
			</AbsoluteFill>

			<AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 100 }}>
				<AnimatedCounter
					value={finaleBranch.currentAssets}
					startFrame={90}
					durationFrames={90}
					label="القيمة الحالية"
					fontSize={70}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
