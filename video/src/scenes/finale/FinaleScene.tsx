import React from "react";
import { Sequence } from "remotion";
import { ClosingShot } from "./ClosingShot";
import { FloorsBreakdown } from "./FloorsBreakdown";
import { FutureVision } from "./FutureVision";
import { GrandTotals } from "./GrandTotals";
import { NewBuildingHero } from "./NewBuildingHero";

const HERO_FRAMES = 500;
const FLOORS_FRAMES = 420;
const FUTURE_FRAMES = 500;
const TOTALS_FRAMES = 460;
const CLOSING_FRAMES = 300;

export const FINALE_DURATION = HERO_FRAMES + FLOORS_FRAMES + FUTURE_FRAMES + TOTALS_FRAMES + CLOSING_FRAMES;

export const FinaleScene: React.FC = () => {
	let cursor = HERO_FRAMES;
	const floorsAt = cursor;
	cursor += FLOORS_FRAMES;
	const futureAt = cursor;
	cursor += FUTURE_FRAMES;
	const totalsAt = cursor;
	cursor += TOTALS_FRAMES;
	const closingAt = cursor;

	return (
		<>
			<Sequence durationInFrames={HERO_FRAMES}>
				<NewBuildingHero durationFrames={HERO_FRAMES} />
			</Sequence>
			<Sequence from={floorsAt} durationInFrames={FLOORS_FRAMES}>
				<FloorsBreakdown />
			</Sequence>
			<Sequence from={futureAt} durationInFrames={FUTURE_FRAMES}>
				<FutureVision durationFrames={FUTURE_FRAMES} />
			</Sequence>
			<Sequence from={totalsAt} durationInFrames={TOTALS_FRAMES}>
				<GrandTotals />
			</Sequence>
			<Sequence from={closingAt} durationInFrames={CLOSING_FRAMES}>
				<ClosingShot durationFrames={CLOSING_FRAMES} />
			</Sequence>
		</>
	);
};
