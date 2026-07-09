import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, gradients } from "../../theme/colors";
import { CitySkyline } from "./CitySkyline";
import { Sky } from "./Sky";
import { StarField } from "./StarField";
import { TitleReveal } from "./TitleReveal";
import { OPENING } from "./timeline";
import { getDroneMotion } from "../../lib/droneMotion";

export const OpeningScene: React.FC = () => {
	const frame = useCurrentFrame();
	const drone = getDroneMotion(frame);

	// --- Fly-in: the drone descends out of the night sky towards the city.
	const flyInProgress = interpolate(frame, [0, OPENING.flyInEnd], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const skylineBaseY = interpolate(flyInProgress, [0, 1], [460, 0]);
	const skylineBaseScale = interpolate(flyInProgress, [0, 1], [1.35, 1]);
	const skyFade = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: "clamp" });
	const starOpacity = interpolate(frame, [0, 40], [0, 0.85], { extrapolateRight: "clamp" });

	// --- Camera orbit around the floating title.
	const orbitProgress = interpolate(frame, [OPENING.holdEnd, OPENING.orbitEnd], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.inOut(Easing.cubic),
	});
	const orbitRotateY = interpolate(orbitProgress, [0, 0.55, 1], [0, 26, -12]);
	const orbitScale = interpolate(orbitProgress, [0, 1], [1, 1.05]);

	// --- Dive down into the city, transitioning out of the opening scene.
	const diveProgress = interpolate(frame, [OPENING.orbitEnd, OPENING.diveEnd], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.in(Easing.cubic),
	});
	const diveSkylineY = interpolate(diveProgress, [0, 1], [0, 300]);
	const diveSkylineScale = interpolate(diveProgress, [0, 1], [1, 2.5]);
	const titleOpacity = interpolate(frame, [OPENING.orbitEnd, OPENING.orbitEnd + 45], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const flashOpacity = interpolate(
		frame,
		[OPENING.diveEnd - 22, OPENING.diveEnd - 6, OPENING.diveEnd],
		[0, 0.85, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	// Speed-linked blur on the nearest layer during the fast dive — a cheap
	// stand-in for directional motion blur that sells velocity.
	const diveSpeedBlur = interpolate(diveProgress, [0, 0.15, 1], [0, 3.2, 5.5], {
		extrapolateLeft: "clamp",
	});

	const skylineTranslateY = skylineBaseY + drone.bobY + diveSkylineY;
	const skylineScale = skylineBaseScale * diveSkylineScale;
	const orbitDrift = orbitRotateY * 3.2;

	return (
		<AbsoluteFill style={{ background: colors.background, overflow: "hidden" }}>
			<Sky opacity={skyFade} driftX={drone.driftX} />
			<StarField opacity={starOpacity} driftX={drone.driftX} />

			<CitySkyline
				layer="far"
				translateX={drone.driftX * 0.35 + orbitDrift * 0.5}
				translateY={skylineTranslateY}
				scale={skylineScale}
				rotateDeg={drone.bankDeg * 0.4}
				glowOpacity={interpolate(flyInProgress, [0, 1], [0, 0.55])}
			/>
			<CitySkyline
				layer="mid"
				translateX={drone.driftX * 0.65 + orbitDrift * 0.85}
				translateY={skylineTranslateY}
				scale={skylineScale}
				rotateDeg={drone.bankDeg * 0.7}
				glowOpacity={interpolate(flyInProgress, [0, 1], [0, 0.8])}
			/>
			<div style={{ position: "absolute", inset: 0, filter: diveSpeedBlur > 0.1 ? `blur(${diveSpeedBlur}px)` : undefined }}>
				<CitySkyline
					layer="near"
					translateX={drone.driftX + orbitDrift * 1.3}
					translateY={skylineTranslateY}
					scale={skylineScale}
					rotateDeg={drone.bankDeg}
					glowOpacity={interpolate(flyInProgress, [0, 1], [0, 1])}
				/>
			</div>

			<AbsoluteFill style={{ background: gradients.cityGlowFog }} />
			<AbsoluteFill style={{ background: gradients.vignette }} />

			<TitleReveal
				startFrame={OPENING.titleStart}
				orbitRotateY={orbitRotateY}
				orbitScale={orbitScale}
				opacity={titleOpacity}
			/>

			<AbsoluteFill
				style={{
					background: `radial-gradient(circle, rgba(255,244,214,1) 0%, ${colors.accent} 55%, rgba(5,10,18,0) 100%)`,
					opacity: flashOpacity,
				}}
			/>
		</AbsoluteFill>
	);
};
