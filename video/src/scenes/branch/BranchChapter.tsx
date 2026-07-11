import React from "react";
import { Sequence } from "remotion";
import type { OperationalBranch } from "../../data/company";
import { branchGalleries } from "../../data/company";
import { BuildingReveal } from "./BuildingReveal";
import { InteriorGallery } from "./InteriorGallery";

export const BUILDING_PHASE_FRAMES = 380;

export const branchChapterDuration = (galleryFrames: number) => BUILDING_PHASE_FRAMES + galleryFrames;

export const BranchChapter: React.FC<{
	branch: OperationalBranch;
	galleryFrames: number;
	panSeed: number;
}> = ({ branch, galleryFrames, panSeed }) => {
	const assets = branchGalleries[branch.assetDir];
	const buildingPhoto = assets.building[0];

	return (
		<>
			<Sequence durationInFrames={BUILDING_PHASE_FRAMES}>
				<BuildingReveal
					branch={branch}
					photoFile={buildingPhoto}
					nameStartFrame={16}
					counterStartFrame={64}
					counterDurationFrames={70}
					durationFrames={BUILDING_PHASE_FRAMES}
					panSeed={panSeed}
				/>
			</Sequence>
			<Sequence from={BUILDING_PHASE_FRAMES} durationInFrames={galleryFrames}>
				<InteriorGallery
					assetDir={branch.assetDir}
					files={assets.gallery}
					durationFrames={galleryFrames}
					panSeedBase={panSeed + 40}
				/>
			</Sequence>
		</>
	);
};
