import { Intro } from "@/components/Intro";
import { FirstMessage } from "@/components/FirstMessage";
import { Timeline } from "@/components/Timeline";
import { Constellation } from "@/components/Constellation";
import { Climax } from "@/components/Climax";
import { Letter } from "@/components/Letter";
import { TwoLights } from "@/components/TwoLights";
import { Garden } from "@/components/Garden";
import { SoundButton } from "@/components/SoundButton";
import { MotionRoot } from "@/components/MotionRoot";

export default function Page() {
  return (
    <MotionRoot>
      <SoundButton />
      <main>
        <Intro />
        <FirstMessage />
        <Timeline />
        <Constellation />
        <Climax />
        <Letter />
        <TwoLights />
        <Garden />
      </main>
    </MotionRoot>
  );
}
