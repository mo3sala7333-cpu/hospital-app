import "./index.css";
import "./theme/fonts";
import { Composition } from "remotion";
import { MainVideo, TOTAL_DURATION } from "./MainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AlHayatInvestorVideo"
        component={MainVideo}
        durationInFrames={TOTAL_DURATION}
        fps={60}
        width={1920}
        height={1080}
      />
    </>
  );
};
