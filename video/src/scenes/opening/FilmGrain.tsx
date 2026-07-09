import React from "react";

// A static fine-noise texture blended at very low opacity — cheap,
// deterministic film-grain texture that avoids per-frame recomputation.
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
	<svg
		style={{
			position: "absolute",
			inset: 0,
			width: "100%",
			height: "100%",
			mixBlendMode: "overlay",
			opacity,
		}}
	>
		<filter id="film-grain-filter">
			<feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={2} seed={7} stitchTiles="stitch" />
			<feColorMatrix type="saturate" values="0" />
		</filter>
		<rect width="100%" height="100%" filter="url(#film-grain-filter)" />
	</svg>
);
