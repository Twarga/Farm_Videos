import React from "react";
import { Composition, Still } from "remotion";
import { HookStill, TOTAL_FRAMES, Video } from "./Video";
import { Thumbnail } from "./Thumbnail";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Video}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still id="HookStill" component={HookStill} width={1920} height={1080} />
      <Composition id="HookTest" component={HookStill} durationInFrames={150} fps={30} width={1920} height={1080} />
      <Still id="Thumbnail1" component={Thumbnail} defaultProps={{ variant: 1 }} width={1280} height={720} />
      <Still id="Thumbnail2" component={Thumbnail} defaultProps={{ variant: 2 }} width={1280} height={720} />
      <Still id="Thumbnail3" component={Thumbnail} defaultProps={{ variant: 3 }} width={1280} height={720} />
    </>
  );
};
