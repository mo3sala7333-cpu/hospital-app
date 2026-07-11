import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { branchAssetPath } from "../../data/company";
import { KenBurnsImage } from "../shared/KenBurnsImage";

export const InteriorGallery: React.FC<{
	assetDir: string;
	files: string[];
	durationFrames: number;
	panSeedBase: number;
}> = ({ assetDir, files, durationFrames, panSeedBase }) => {
	const frame = useCurrentFrame();

	const overlap = 24;
	const slice = Math.floor((durationFrames + overlap * (files.length - 1)) / files.length);

	// A quick brightness/blur pulse at the very start sells "walking through
	// the door" into the building.
	const enterFlash = interpolate(frame, [0, 10, 26], [0.9, 0, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const enterBlur = interpolate(frame, [0, 22], [10, 0], { extrapolateRight: "clamp" });

	return (
		<AbsoluteFill style={{ background: colors.background, overflow: "hidden" }}>
			<div style={{ position: "absolute", inset: 0, filter: enterBlur > 0.2 ? `blur(${enterBlur}px)` : undefined }}>
				{files.map((file, i) => {
					const start = i * (slice - overlap);
					return (
						<KenBurnsImage
							key={file}
							src={branchAssetPath(assetDir, "gallery", file)}
							startFrame={start}
							durationFrames={slice}
							panSeed={panSeedBase + i * 5.1}
							fadeInFrames={overlap}
							fadeOutFrames={overlap}
							zoomFrom={1.02}
							zoomTo={1.14}
							grade="saturate(1.05) contrast(1.04) brightness(1.02)"
						/>
					);
				})}
			</div>

			<AbsoluteFill
				style={{
					background:
						"linear-gradient(180deg, rgba(5,10,18,0.35) 0%, rgba(5,10,18,0) 22%, rgba(5,10,18,0) 78%, rgba(5,10,18,0.6) 100%)",
				}}
			/>
			<AbsoluteFill style={{ background: colors.text, opacity: enterFlash }} />
		</AbsoluteFill>
	);
};
