import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OpeningScene } from "./scenes/opening/OpeningScene";
import { OPENING_DURATION } from "./scenes/opening/timeline";

// Scene by scene, per the approved plan:
// 1. Opening — drone over the smart city, title reveal, orbit, dive. (done)
// 2. Branch chapters — one per operational branch. (pending)
// 3. Grand finale — the new building. (pending)
export const TOTAL_DURATION = OPENING_DURATION;

export const MainVideo: React.FC = () => {
	return (
		<AbsoluteFill style={{ background: "#050A12" }}>
			<Sequence durationInFrames={OPENING_DURATION} name="Opening">
				<OpeningScene />
			</Sequence>
		</AbsoluteFill>
	);
};
