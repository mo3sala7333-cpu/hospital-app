import React, { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { deterministicRandom } from "../../lib/deterministicRandom";

const COUNT = 46;

export const ParticleBurst: React.FC<{ startFrame: number; opacity?: number }> = ({
	startFrame,
	opacity = 1,
}) => {
	const frame = useCurrentFrame();
	const local = frame - startFrame;

	const particles = useMemo(
		() =>
			Array.from({ length: COUNT }).map((_, i) => {
				const s = i * 4.13;
				const angle = deterministicRandom(s) * Math.PI * 2;
				const distance = 240 + deterministicRandom(s + 1) * 620;
				const size = 2 + deterministicRandom(s + 2) * 4;
				const delay = deterministicRandom(s + 3) * 14;
				const warm = deterministicRandom(s + 4) > 0.4;
				return { angle, distance, size, delay, warm };
			}),
		[],
	);

	if (local < 0) return null;

	return (
		<div style={{ position: "absolute", inset: 0, opacity }}>
			{particles.map((p, i) => {
				const t = interpolate(local - p.delay, [0, 70], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: Easing.out(Easing.cubic),
				});
				const fade = interpolate(local - p.delay, [40, 90], [1, 0], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				const x = Math.cos(p.angle) * p.distance * t;
				const y = Math.sin(p.angle) * p.distance * t;
				const color = p.warm ? colors.accent : "#bfe9e0";
				return (
					<div
						key={i}
						style={{
							position: "absolute",
							left: "50%",
							top: "50%",
							width: p.size,
							height: p.size,
							borderRadius: "50%",
							background: color,
							boxShadow: `0 0 ${p.size * 3}px ${color}`,
							opacity: fade,
							transform: `translate(${x}px, ${y}px)`,
						}}
					/>
				);
			})}
		</div>
	);
};
