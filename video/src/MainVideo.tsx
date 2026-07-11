import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { operationalBranches, branchGalleries, finaleBranch } from "./data/company";
import { OpeningScene } from "./scenes/opening/OpeningScene";
import { OPENING_DURATION } from "./scenes/opening/timeline";
import { BranchChapter, branchChapterDuration } from "./scenes/branch/BranchChapter";
import { GlowPathTransition } from "./scenes/branch/GlowPathTransition";
import { FinaleScene, FINALE_DURATION } from "./scenes/finale/FinaleScene";

const TRANSITION_FRAMES = 150;

const galleryFramesFor = (assetDir: string) => {
	const count = branchGalleries[assetDir].gallery.length;
	return Math.max(330, count * 90);
};

type Block = { from: number; duration: number };

const buildTimeline = () => {
	const branchBlocks: Block[] = [];
	const transitionBlocks: Block[] = [];
	let cursor = OPENING_DURATION;

	operationalBranches.forEach((branch) => {
		const duration = branchChapterDuration(galleryFramesFor(branch.assetDir));
		branchBlocks.push({ from: cursor, duration });
		cursor += duration;
		transitionBlocks.push({ from: cursor, duration: TRANSITION_FRAMES });
		cursor += TRANSITION_FRAMES;
	});

	const finaleFrom = cursor;
	cursor += FINALE_DURATION;

	return { branchBlocks, transitionBlocks, finaleFrom, total: cursor };
};

const timeline = buildTimeline();

export const TOTAL_DURATION = timeline.total;

export const MainVideo: React.FC = () => {
	return (
		<AbsoluteFill style={{ background: "#050A12" }}>
			<Sequence durationInFrames={OPENING_DURATION} name="Opening">
				<OpeningScene />
			</Sequence>

			{operationalBranches.map((branch, i) => {
				const block = timeline.branchBlocks[i];
				const transition = timeline.transitionBlocks[i];
				const next = operationalBranches[i + 1]?.name ?? finaleBranch.name;
				return (
					<React.Fragment key={branch.id}>
						<Sequence from={block.from} durationInFrames={block.duration} name={branch.name}>
							<BranchChapter branch={branch} galleryFrames={galleryFramesFor(branch.assetDir)} panSeed={i * 100} />
						</Sequence>
						<Sequence from={transition.from} durationInFrames={transition.duration} name={`${branch.name} -> ${next}`}>
							<GlowPathTransition fromName={branch.name} toName={next} durationFrames={transition.duration} />
						</Sequence>
					</React.Fragment>
				);
			})}

			<Sequence from={timeline.finaleFrom} durationInFrames={FINALE_DURATION} name="Finale">
				<FinaleScene />
			</Sequence>
		</AbsoluteFill>
	);
};
