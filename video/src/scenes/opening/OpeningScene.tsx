import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, gradients } from "../../theme/colors";
import { CitySkyline } from "./CitySkyline";
import { StarField } from "./StarField";
import { TitleReveal } from "./TitleReveal";
import { OPENING } from "./timeline";

export const OpeningScene: React.FC = () => {
	const frame = useCurrentFrame();

	// --- Fly-in: the drone descends out of the night sky towards the city.
	const flyInProgress = interpolate(frame, [0, OPENING.flyInEnd], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const skylineBaseY = interpolate(flyInProgress, [0, 1], [520, 0]);
	const skylineBaseScale = interpolate(flyInProgress, [0, 1], [1.5, 1]);
	const skyFade = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });
	const starOpacity = interpolate(frame, [0, 30], [0, 0.9], { extrapolateRight: "clamp" });

	// --- Gentle ambient drift throughout (handheld drone feel).
	const driftX = Math.sin(frame / 95) * 18;

	// --- Camera orbit around the floating title.
	const orbitProgress = interpolate(frame, [OPENING.holdEnd, OPENING.orbitEnd], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.inOut(Easing.cubic),
	});
	const orbitRotateY = interpolate(orbitProgress, [0, 0.55, 1], [0, 30, -14]);
	const orbitScale = interpolate(orbitProgress, [0, 1], [1, 1.06]);
	const orbitSkylineShift = interpolate(orbitProgress, [0, 1], [0, -70]);

	// --- Dive down into the city, transitioning out of the opening scene.
	const diveProgress = interpolate(frame, [OPENING.orbitEnd, OPENING.diveEnd], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.in(Easing.cubic),
	});
	const diveSkylineY = interpolate(diveProgress, [0, 1], [0, 260]);
	const diveSkylineScale = interpolate(diveProgress, [0, 1], [1, 2.3]);
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

	const skylineTranslateY = skylineBaseY + orbitSkylineShift * 0 + diveSkylineY;
	const skylineTranslateX = driftX;
	const skylineScale = skylineBaseScale * (1 + (diveSkylineScale - 1));

	return (
		<AbsoluteFill style={{ background: colors.background, overflow: "hidden" }}>
			<AbsoluteFill style={{ background: gradients.duskSky, opacity: skyFade }} />
			<StarField opacity={starOpacity} />

			<CitySkyline
				layer="far"
				translateY={skylineTranslateY}
				translateX={skylineTranslateX + orbitRotateY * 1.4}
				scale={skylineScale}
				parallax={0.4}
				glowOpacity={interpolate(flyInProgress, [0, 1], [0, 0.6])}
			/>
			<CitySkyline
				layer="mid"
				translateY={skylineTranslateY}
				translateX={skylineTranslateX + orbitRotateY * 2.6}
				scale={skylineScale}
				parallax={0.7}
				glowOpacity={interpolate(flyInProgress, [0, 1], [0, 0.85])}
			/>
			<CitySkyline
				layer="near"
				translateY={skylineTranslateY}
				translateX={skylineTranslateX + orbitRotateY * 4.2}
				scale={skylineScale}
				parallax={1}
				glowOpacity={interpolate(flyInProgress, [0, 1], [0, 1])}
			/>

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
