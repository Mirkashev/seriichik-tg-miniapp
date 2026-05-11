import { ConnectBusinessGuide } from "@/features/connect-business-guide";

export const TestPage = () => {
  // return <Button onClick={() => { throw new Error('test error') }}>click error</Button>

  return (
    <ConnectBusinessGuide onCopyBotUsername={() => {}} />
  );
};
