import { useNavigate } from "react-router-dom";
import { ConnectBusinessGuide } from "@/features/connect-business-guide";
import { useEffect } from "react";
import { backButton } from "@tma.js/sdk-react";

export const HowToConnectBusiness = () => {
  const navigate = useNavigate();

  const handleCopyBotUsername = () => {
    navigator.clipboard.writeText(import.meta.env.VITE_BOT_NAME);
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
    <ConnectBusinessGuide onCopyBotUsername={handleCopyBotUsername} />
  );
};