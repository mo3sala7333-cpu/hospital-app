import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { deterministicRandom } from "../../lib/deterministicRandom";

const STAR_COUNT = 90;

export const StarField: React.FC<{ opacity: number; driftX?: number }> = ({
	opacity,
	driftX = 0,
}) => {
	const frame = useCurrentFrame();

	const stars = useMemo(
		() =>
			Array.from({ length: STAR_COUNT }).map((_, i) => ({
				top: deterministicRandom(i * 3.1) * 55,
				left: deterministicRandom(i * 7.7 + 1) * 100,
				size: 0.6 + deterministicRandom(i * 11.3 + 2) * 1.2,
				phase: deterministicRandom(i * 5.5 + 3) * Math.PI * 2,
				speed: 0.03 + deterministicRandom(i * 2.2 + 4) * 0.05,
			})),
		[],
	);

	return (
		<div style={{ position: "absolute", inset: 0, opacity, transform: `translateX(${driftX * 0.04}px)` }}>
			{stars.map((s, i) => {
				const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame * s.speed + s.phase));
				return (
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
							opacity: twinkle,
							boxShadow: `0 0 ${s.size * 2}px rgba(255,255,255,${twinkle * 0.6})`,
						}}
					/>
				);
			})}
		</div>
	);
};
