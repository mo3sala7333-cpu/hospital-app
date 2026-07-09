import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, gradients } from "../../theme/colors";
import { getDroneMotion } from "../../lib/droneMotion";
import { CitySkyline } from "./CitySkyline";
import { FilmGrain } from "./FilmGrain";
import { LogoReveal, ReadabilityScrim } from "./LogoReveal";
import { RoadLights } from "./RoadLights";
import { Sky } from "./Sky";
import { TitleReveal } from "./TitleReveal";
import { OPENING } from "./timeline";

export const OpeningScene: React.FC = () => {
	const frame = useCurrentFrame();
	const drone = getDroneMotion(frame);

	// --- Establishing fade-in.
	const skyFade = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: "clamp" });
	const cityGlow = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });

	// --- Slow continuous push-in for tension; accelerates sharply during
	// the transition-out to sell a dive into the next scene.
	const baseZoom = interpolate(frame, [0, OPENING.transitionStart], [1, 1.09], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.quad),
	});
	const diveZoom = interpolate(frame, [OPENING.transitionStart, OPENING.diveEnd], [1, 1.55], {
		extrapolateLeft: "clamp",
		easing: Easing.in(Easing.cubic),
	});
	const zoom = baseZoom * diveZoom;
	const diveSpeedBlur = interpolate(
		frame,
		[OPENING.transitionStart, OPENING.transitionStart + 40, OPENING.diveEnd],
		[0, 2.6, 5.5],
		{ extrapolateLeft: "clamp" },
	);

	// --- Logo + title group: fades in, holds, fades out ahead of the flash.
	const groupOpacity = interpolate(
		frame,
		[OPENING.logoStart, OPENING.logoStart + 20, OPENING.transitionStart, OPENING.transitionStart + 45],
		[0, 1, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const scrimOpacity = interpolate(
		frame,
		[OPENING.logoStart, OPENING.logoStart + 30, OPENING.transitionStart, OPENING.transitionStart + 45],
		[0, 0.85, 0.85, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	// --- Transition out: bright gold/white bloom, ends fully opaque as a
	// clean hand-off point into the الحياة ١ chapter.
	const flashOpacity = interpolate(frame, [OPENING.transitionStart + 20, OPENING.diveEnd], [0, 1], {
		extrapolateLeft: "clamp",
		easing: Easing.in(Easing.cubic),
	});

	return (
		<AbsoluteFill style={{ background: colors.background, overflow: "hidden" }}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					transform: `scale(${zoom})`,
					transformOrigin: "50% 62%",
					filter: diveSpeedBlur > 0.1 ? `blur(${diveSpeedBlur}px)` : undefined,
				}}
			>
				<Sky opacity={skyFade} driftX={drone.driftX} />
				<CitySkyline
					layer="far"
					translateX={drone.driftX * 0.35}
					translateY={drone.bobY}
					scale={1}
					rotateDeg={drone.bankDeg * 0.4}
					glowOpacity={interpolate(cityGlow, [0, 1], [0, 0.55])}
				/>
				<CitySkyline
					layer="mid"
					translateX={drone.driftX * 0.65}
					translateY={drone.bobY}
					scale={1}
					rotateDeg={drone.bankDeg * 0.7}
					glowOpacity={interpolate(cityGlow, [0, 1], [0, 0.8])}
				/>
				<CitySkyline
					layer="near"
					translateX={drone.driftX}
					translateY={drone.bobY}
					scale={1}
					rotateDeg={drone.bankDeg}
					glowOpacity={interpolate(cityGlow, [0, 1], [0, 1])}
				/>
				<RoadLights
					translateX={drone.driftX * 1.15}
					scale={1}
					opacity={interpolate(cityGlow, [0, 1], [0, 0.95])}
				/>
				<AbsoluteFill style={{ background: gradients.cityGlowFog }} />
			</div>

			<AbsoluteFill style={{ background: gradients.vignette }} />
			<FilmGrain opacity={0.045} />

			<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
				<ReadabilityScrim opacity={scrimOpacity} />
				<div
					style={{
						position: "relative",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						opacity: groupOpacity,
					}}
				>
					<LogoReveal startFrame={OPENING.logoStart} />
					<div style={{ marginTop: 6 }}>
						<TitleReveal startFrame={OPENING.titleStart} />
					</div>
				</div>
			</AbsoluteFill>

			<AbsoluteFill
				style={{
					background: `radial-gradient(circle, rgba(255,248,224,1) 0%, ${colors.accent} 45%, rgba(181,113,58,0.9) 75%, ${colors.background} 100%)`,
					opacity: flashOpacity,
				}}
			/>
		</AbsoluteFill>
	);
};
