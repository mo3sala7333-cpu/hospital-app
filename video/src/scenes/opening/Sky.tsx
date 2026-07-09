import React, { useMemo } from "react";
import { colors, gradients } from "../../theme/colors";
import { deterministicRandom } from "../../lib/deterministicRandom";

const CLOUD_COUNT = 6;
const STAR_COUNT = 70;

export const Sky: React.FC<{ opacity: number; driftX: number }> = ({ opacity, driftX }) => {
	const clouds = useMemo(
		() =>
			Array.from({ length: CLOUD_COUNT }).map((_, i) => {
				const s = i * 9.3;
				return {
					top: 6 + deterministicRandom(s) * 26,
					left: deterministicRandom(s + 1) * 100,
					width: 260 + deterministicRandom(s + 2) * 420,
					height: 40 + deterministicRandom(s + 3) * 50,
					opacity: 0.05 + deterministicRandom(s + 4) * 0.08,
					parallax: 0.05 + deterministicRandom(s + 5) * 0.08,
				};
			}),
		[],
	);

	const stars = useMemo(
		() =>
			Array.from({ length: STAR_COUNT }).map((_, i) => ({
				top: deterministicRandom(i * 3.1) * 45,
				left: deterministicRandom(i * 7.7 + 1) * 100,
				size: 0.6 + deterministicRandom(i * 11.3 + 2) * 1.1,
				opacity: 0.3 + deterministicRandom(i * 5.5 + 3) * 0.5,
			})),
		[],
	);

	return (
		<div style={{ position: "absolute", inset: 0, opacity }}>
			<div style={{ position: "absolute", inset: 0, background: gradients.duskSky }} />
			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					height: "44%",
					background: gradients.horizonGlow,
				}}
			/>
			{stars.map((s, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						top: `${s.top}%`,
						left: `${s.left}%`,
						width: s.size,
						height: s.size,
						borderRadius: "50%",
						background: "#ffffff",
						opacity: s.opacity,
					}}
				/>
			))}
			{clouds.map((c, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						top: `${c.top}%`,
						left: `${c.left}%`,
						width: c.width,
						height: c.height,
						borderRadius: "50%",
						background: colors.cloud,
						opacity: c.opacity,
						filter: "blur(38px)",
						transform: `translateX(${driftX * c.parallax}px)`,
					}}
				/>
			))}
		</div>
	);
};
