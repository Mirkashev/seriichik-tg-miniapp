import { useNavigate } from "react-router-dom";
import { BeforeStreakPremium } from "@/pages/streaks/ui/BeforeStreakPremium";
import { useEffect } from "react";
import { backButton } from "@tma.js/sdk-react";

export const HowToConnectBusiness = () => {
  const navigate = useNavigate();

  const handleCopyBotUsername = () => {
    navigator.clipboard.writeText(import.meta.env.VITE_BOT_NAME);
  };

  const handleRedirectToHowToConnect = () => {
    navigate("/how-to-connect-business");
  };

  useEffect(() => {
    try {
      backButton.mount();
      backButton.show();
      backButton.onClick(() => {
        navigate("/streaks");
      });
    } catch (error: unknown) {
      console.warn("Failed to mount back button:", error);
    }
  }, [navigate]);

  return (
    <BeforeStreakPremium
      onCopyBotUsername={handleCopyBotUsername}
      onVideoInstructions={handleRedirectToHowToConnect}
    />
  );
};