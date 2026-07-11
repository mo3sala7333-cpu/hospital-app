import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../theme/colors";
import { finaleBranch } from "../../data/company";
import { formatEGP } from "../../theme/formatCurrency";
import { cairo } from "../../theme/fonts";
import { MaskWipeText } from "../shared/MaskWipeText";

const ROW_STAGGER = 12;

const FloorRow: React.FC<{ name: string; value: number; index: number }> = ({ name, value, index }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const startFrame = 50 + index * ROW_STAGGER;
	const progress = spring({ frame: frame - startFrame, fps, config: { damping: 200, mass: 0.6 } });

	return (
		<div
			dir="rtl"
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				width: 760,
				padding: "16px 28px",
				borderBottom: "1px solid rgba(212,175,55,0.18)",
				opacity: interpolate(progress, [0, 1], [0, 1]),
				transform: `translateX(${interpolate(progress, [0, 1], [-40, 0])}px)`,
			}}
		>
			<span style={{ fontFamily: cairo, fontWeight: 600, fontSize: 28, color: colors.text }}>{name}</span>
			<span style={{ fontFamily: cairo, fontWeight: 700, fontSize: 28, color: colors.accent }}>
				{formatEGP(value)} ج.م
			</span>
		</div>
	);
};

export const FloorsBreakdown: React.FC = () => {
	return (
		<AbsoluteFill style={{ background: colors.background }}>
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(ellipse at 50% 30%, rgba(15,118,110,0.18) 0%, rgba(5,10,18,0) 60%)",
				}}
			/>
			<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
				<div style={{ marginBottom: 30 }}>
					<MaskWipeText text="توزيع الأدوار" startFrame={6} fontSize={44} fontWeight={700} />
				</div>
				<div>
					{finaleBranch.floors.map((floor, i) => (
						<FloorRow key={floor.name} name={floor.name} value={floor.value} index={i} />
					))}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
