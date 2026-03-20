import { useEffect, useRef, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { useLaunchParams } from "@tma.js/sdk-react";

const PET_PREFIX = "pet_";

function parsePetChatId(raw: string | null | undefined): string | null {
  if (!raw || !raw.startsWith(PET_PREFIX)) return null;
  const id = raw.slice(PET_PREFIX.length);
  return id.length > 0 ? id : null;
}

/**
 * Обрабатывает tgWebAppStartParam (из URL или launch params Telegram) вида pet_<chatId>
 * и переводит на /streak/<chatId>.
 */
export const TelegramStartParamProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const launchParams = useLaunchParams(true);
  const didRedirect = useRef(false);

  useEffect(() => {
    if (didRedirect.current) return;

    const fromQuery = new URLSearchParams(window.location.search).get(
      "tgWebAppStartParam",
    );
    const raw = fromQuery ?? launchParams.tgWebAppStartParam ?? null;
    const chatId = parsePetChatId(raw);
    if (!chatId) return;

    didRedirect.current = true;
    navigate(`/streak/${chatId}`, { replace: true });
  }, [navigate, launchParams.tgWebAppStartParam]);

  return <>{children}</>;
};
