import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { finaleAssets, finaleBranch, branchAssetPath } from "../../data/company";
import { formatEGP } from "../../theme/formatCurrency";
import { cairo } from "../../theme/fonts";
import { AnimatedCounter } from "../branch/AnimatedCounter";
import { KenBurnsImage } from "../shared/KenBurnsImage";
import { MaskWipeText } from "../shared/MaskWipeText";

export const FutureVision: React.FC<{ durationFrames: number }> = ({ durationFrames }) => {
	const frame = useCurrentFrame();
	const overlap = 30;
	const slice = Math.floor((durationFrames + overlap) / 2);

	const deltaOpacity = interpolate(frame, [170, 200], [0, 1], { extrapolateLeft: "clamp" });

	return (
		<AbsoluteFill style={{ background: colors.background, overflow: "hidden" }}>
			{finaleAssets.future.map((file, i) => (
				<KenBurnsImage
					key={file}
					src={branchAssetPath(finaleBranch.assetDir, "future", file)}
					startFrame={i * (slice - overlap)}
					durationFrames={slice}
					panSeed={260 + i * 6}
					fadeInFrames={overlap}
					fadeOutFrames={overlap}
					zoomFrom={1.0}
					zoomTo={1.14}
					grade="saturate(1.08) contrast(1.06) brightness(1.02)"
				/>
			))}

			<AbsoluteFill
				style={{
					background:
						"linear-gradient(180deg, rgba(5,10,18,0.55) 0%, rgba(5,10,18,0.05) 32%, rgba(5,10,18,0.1) 60%, rgba(5,10,18,0.92) 100%)",
				}}
			/>

			<AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 80 }}>
				<MaskWipeText text="الرؤية المستقبلية" startFrame={10} fontSize={50} fontWeight={700} />
			</AbsoluteFill>

			<AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 110, gap: 14 }}>
				<AnimatedCounter
					value={finaleBranch.expectedTotalValue}
					startFrame={70}
					durationFrames={90}
					label="القيمة المتوقعة بعد الإكتمال"
					fontSize={64}
				/>
				<div
					dir="rtl"
					style={{
						opacity: deltaOpacity,
						fontFamily: cairo,
						fontWeight: 700,
						fontSize: 26,
						color: colors.secondary,
						textShadow: "0 2px 10px rgba(0,0,0,0.6)",
					}}
				>
					+{formatEGP(finaleBranch.expectedAdditionalValue)} ج.م قيمة مضافة
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
