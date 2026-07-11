import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, gradients } from "../../theme/colors";
import { financial } from "../../data/company";
import { cairo } from "../../theme/fonts";
import { AnimatedCounter } from "../branch/AnimatedCounter";
import { MaskWipeText } from "../shared/MaskWipeText";
import { ParticleBurst } from "./ParticleBurst";

const Operator: React.FC<{ symbol: string; startFrame: number }> = ({ symbol, startFrame }) => {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [startFrame, startFrame + 16], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	return (
		<div style={{ fontFamily: cairo, fontWeight: 700, fontSize: 40, color: colors.secondary, opacity }}>
			{symbol}
		</div>
	);
};

export const GrandTotals: React.FC = () => {
	const frame = useCurrentFrame();

	const noteOpacity = interpolate(frame, [300, 330], [0, 1], { extrapolateLeft: "clamp" });
	const shareOpacity = interpolate(frame, [360, 390], [0, 1], { extrapolateLeft: "clamp" });

	return (
		<AbsoluteFill style={{ background: colors.background }}>
			<AbsoluteFill style={{ background: gradients.vignette }} />
			<ParticleBurst startFrame={150} opacity={0.85} />

			<AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 4 }}>
				<MaskWipeText text="القيمة الإجمالية للشركة" startFrame={4} fontSize={30} fontWeight={600} />

				<div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 26 }}>
					<AnimatedCounter
						value={financial.currentTotalAssets}
						startFrame={40}
						durationFrames={60}
						label="الأصول الحالية"
						fontSize={36}
					/>
					<Operator symbol="+" startFrame={95} />
					<AnimatedCounter
						value={financial.capitalIncreaseAfterCompletion}
						startFrame={100}
						durationFrames={50}
						label="الزيادة الرأسمالية"
						fontSize={36}
					/>
				</div>

				<Operator symbol="=" startFrame={158} />

				<div style={{ marginTop: 4 }}>
					<AnimatedCounter
						value={financial.totalAssetsAfterCompletion}
						startFrame={165}
						durationFrames={70}
						label="إجمالي الأصول بعد الإكتمال"
						fontSize={86}
					/>
				</div>

				<div
					dir="rtl"
					style={{
						marginTop: 26,
						maxWidth: 700,
						textAlign: "center",
						fontFamily: cairo,
						fontWeight: 400,
						fontSize: 18,
						color: "rgba(255,255,255,0.65)",
						opacity: noteOpacity,
					}}
				>
					قيمة العلامة التجارية غير مدرجة ضمن إجمالي الأصول، وهو ما يزيد من القيمة الفعلية للشركة
				</div>

				<div style={{ marginTop: 22, opacity: shareOpacity }}>
					<AnimatedCounter
						value={financial.expectedShareValue}
						startFrame={390}
						durationFrames={40}
						label="القيمة المتوقعة للسهم"
						fontSize={40}
					/>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
