import React from "react";
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { deterministicRandom } from "../../lib/deterministicRandom";

// A slow procedural pan+zoom on a still photo — every image gets a subtly
// different direction (derived from panSeed) so a run of photos never
// feels mechanically identical.
export const KenBurnsImage: React.FC<{
	src: string;
	startFrame: number;
	durationFrames: number;
	panSeed: number;
	fadeInFrames?: number;
	fadeOutFrames?: number;
	zoomFrom?: number;
	zoomTo?: number;
	grade?: string;
}> = ({
	src,
	startFrame,
	durationFrames,
	panSeed,
	fadeInFrames = 20,
	fadeOutFrames = 20,
	zoomFrom = 1.04,
	zoomTo = 1.16,
	grade,
}) => {
	const frame = useCurrentFrame();
	const local = frame - startFrame;
	const progress = interpolate(local, [0, durationFrames], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.inOut(Easing.quad),
	});

	const angle = deterministicRandom(panSeed) * Math.PI * 2;
	const panDist = 2.2 + deterministicRandom(panSeed + 1) * 1.6;
	const panX = Math.cos(angle) * panDist;
	const panY = Math.sin(angle) * panDist * 0.6;

	const scale = interpolate(progress, [0, 1], [zoomFrom, zoomTo]);
	const translateX = interpolate(progress, [0, 1], [0, panX]);
	const translateY = interpolate(progress, [0, 1], [0, panY]);

	const opacity = interpolate(
		local,
		[0, fadeInFrames, durationFrames - fadeOutFrames, durationFrames],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	return (
		<div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity }}>
			<Img
				src={src.startsWith("http") ? src : staticFile(src)}
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
					filter: grade,
				}}
			/>
		</div>
	);
};
