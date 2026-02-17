import { Button } from "@/shared/ui/Button";

export const TestPage = () => {
  return <Button onClick={() => { throw new Error('test error') }}>click error</Button>

  // return (
  //   <BeforeStreakPremium
  //     onCopyBotUsername={handleCopyBotUsername}
  //     onVideoInstructions={handleVideoInstructions}
  //   />
  // );
};
