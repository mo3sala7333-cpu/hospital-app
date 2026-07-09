import React, { useMemo } from "react";
import { colors, gradients } from "../../theme/colors";
import { deterministicRandom } from "../../lib/deterministicRandom";

const CLOUD_COUNT = 6;

export const Sky: React.FC<{ opacity: number; driftX: number }> = ({ opacity, driftX }) => {
	const clouds = useMemo(
		() =>
			Array.from({ length: CLOUD_COUNT }).map((_, i) => {
				const s = i * 9.3;
				return {
					top: 8 + deterministicRandom(s) * 34,
					left: deterministicRandom(s + 1) * 100,
					width: 260 + deterministicRandom(s + 2) * 420,
					height: 40 + deterministicRandom(s + 3) * 50,
					opacity: 0.06 + deterministicRandom(s + 4) * 0.1,
					parallax: 0.05 + deterministicRandom(s + 5) * 0.08,
				};
			}),
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
					height: "48%",
					background: gradients.horizonGlow,
				}}
			/>
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
