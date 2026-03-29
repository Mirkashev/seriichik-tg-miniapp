import { BeforeStreakPremium } from "../streaks/ui/BeforeStreakPremium";

export const TestPage = () => {
  // return <Button onClick={() => { throw new Error('test error') }}>click error</Button>

  return (
    <BeforeStreakPremium
      onCopyBotUsername={() => { }}
      onVideoInstructions={() => { }}
    />
  );
};
