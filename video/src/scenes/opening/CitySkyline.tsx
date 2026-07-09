import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { generateCityLayer, type Building } from "./cityGenerator";

type LayerName = "far" | "mid" | "near";

const LAYER_CONFIG: Record<
	LayerName,
	{
		seed: number;
		count: number;
		minH: number;
		maxH: number;
		detail: "silhouette" | "sparse" | "detailed";
		widthScale: number;
		gradientTop: string;
		gradientBottom: string;
		blurPx: number;
	}
> = {
	far: {
		seed: 1,
		count: 24,
		minH: 70,
		maxH: 190,
		detail: "silhouette",
		widthScale: 1,
		gradientTop: "#3b5570",
		gradientBottom: "#16273b",
		blurPx: 2.2,
	},
	mid: {
		seed: 50,
		count: 17,
		minH: 130,
		maxH: 330,
		detail: "sparse",
		widthScale: 1.05,
		gradientTop: "#254058",
		gradientBottom: "#0d1c2e",
		blurPx: 0.8,
	},
	near: {
		seed: 120,
		count: 12,
		minH: 220,
		maxH: 480,
		detail: "detailed",
		widthScale: 1.5,
		gradientTop: "#1c3346",
		gradientBottom: "#060f1a",
		blurPx: 0,
	},
};

const SVG_HEIGHT = 620;

const BuildingShape: React.FC<{ b: Building; fill: string; rimColor: string }> = ({
	b,
	fill,
	rimColor,
}) => (
	<g>
		<rect x={b.x} y={SVG_HEIGHT - b.height} width={b.width} height={b.height} fill={fill} />
		{b.setback ? (
			<rect
				x={b.x + (b.width - b.setback.width) / 2}
				y={SVG_HEIGHT - b.height - b.setback.height}
				width={b.setback.width}
				height={b.setback.height}
				fill={fill}
			/>
		) : null}
		{b.antenna ? (
			<line
				x1={b.x + b.width / 2}
				x2={b.x + b.width / 2}
				y1={SVG_HEIGHT - b.height - (b.setback?.height ?? 0)}
				y2={SVG_HEIGHT - b.height - (b.setback?.height ?? 0) - b.antenna.height}
				stroke={fill}
				strokeWidth={2}
			/>
		) : null}
		{b.rimLight ? (
			<rect
				x={b.x + b.width - 2}
				y={SVG_HEIGHT - b.height}
				width={2}
				height={b.height}
				fill={rimColor}
				opacity={0.5}
			/>
		) : null}
	</g>
);

export const CitySkyline: React.FC<{
	layer: LayerName;
	translateX: number;
	translateY: number;
	scale: number;
	rotateDeg: number;
	glowOpacity: number;
}> = ({ layer, translateX, translateY, scale, rotateDeg, glowOpacity }) => {
	const frame = useCurrentFrame();
	const config = LAYER_CONFIG[layer];

	const city = useMemo(
		() =>
			generateCityLayer(
				config.seed,
				config.count,
				config.minH,
				config.maxH,
				config.detail,
				config.widthScale,
			),
		[config],
	);

	// Tile the generated span so a full pass covers the viewport plus drift
	// headroom without ever showing a seam.
	const tiles = Math.max(2, Math.ceil((1920 + 500) / city.spanWidth) + 1);

	const gradientId = `city-grad-${layer}`;

	const windows = useMemo(() => {
		const els: React.ReactNode[] = [];
		city.buildings.forEach((b, bi) => {
			b.glowWindows.forEach((w, wi) => {
				const blink = w.blink
					? 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame / 26 + w.phase))
					: 1;
				els.push(
					<rect
						key={`${bi}-${wi}`}
						x={b.x + w.x}
						y={SVG_HEIGHT - b.height + w.y}
						width={w.w}
						height={w.h}
						fill={w.warm ? colors.windowWarm : colors.windowCool}
						opacity={blink}
					/>,
				);
			});
		});
		return els;
	}, [city, frame]);

	const antennaLights = useMemo(() => {
		const els: React.ReactNode[] = [];
		city.buildings.forEach((b, bi) => {
			if (!b.antenna) return;
			const blink = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / 18 + b.antenna.blinkPhase));
			els.push(
				<circle
					key={bi}
					cx={b.x + b.width / 2}
					cy={SVG_HEIGHT - b.height - (b.setback?.height ?? 0) - b.antenna.height}
					r={2.4}
					fill={colors.windowWarm}
					opacity={blink}
				/>,
			);
		});
		return els;
	}, [city, frame]);

	return (
		<div
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 0,
				height: SVG_HEIGHT,
				overflow: "hidden",
				filter: config.blurPx ? `blur(${config.blurPx}px)` : undefined,
			}}
		>
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: "50%",
					width: city.spanWidth * tiles,
					height: SVG_HEIGHT,
					transform: `translateX(calc(-50% + ${translateX}px)) translateY(${translateY}px) scale(${scale}) rotate(${rotateDeg}deg)`,
					transformOrigin: "50% 100%",
				}}
			>
				<svg
					width={city.spanWidth * tiles}
					height={SVG_HEIGHT}
					viewBox={`0 0 ${city.spanWidth * tiles} ${SVG_HEIGHT}`}
					style={{ position: "absolute", bottom: 0, left: 0 }}
				>
					<defs>
						<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={config.gradientTop} />
							<stop offset="100%" stopColor={config.gradientBottom} />
						</linearGradient>
					</defs>
					{Array.from({ length: tiles }).map((_, t) => (
						<g key={t} transform={`translate(${t * city.spanWidth}, 0)`}>
							{city.buildings.map((b, bi) => (
								<BuildingShape
									key={bi}
									b={b}
									fill={`url(#${gradientId})`}
									rimColor={colors.horizonWarm}
								/>
							))}
							{config.detail !== "silhouette" ? (
								<>
									<g opacity={0.5 * glowOpacity} style={{ filter: "blur(5px)" }}>
										{windows}
									</g>
									<g opacity={glowOpacity}>{windows}</g>
									<g>{antennaLights}</g>
								</>
							) : null}
						</g>
					))}
				</svg>
			</div>
		</div>
	);
};
