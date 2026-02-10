import { BeforeStreakPremium } from "@/pages/streaks/ui/BeforeStreakPremium";

export const TestPage = () => {
  const handleCopyBotUsername = () => {
    navigator.clipboard.writeText(import.meta.env.VITE_BOT_NAME);
  };

  const handleVideoInstructions = () => {
    // TODO: Implement video instructions
  };

  return (
    <BeforeStreakPremium
      onCopyBotUsername={handleCopyBotUsername}
      onVideoInstructions={handleVideoInstructions}
    />
  );
};
