import { type NextPage } from "next";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import Head from "next/head";
import { useEffect } from "react";

interface SlackProps {
  accessToken: string;
}

const Slack: NextPage<SlackProps> = ({ accessToken }) => {
  useEffect(() => {
    console.log("Access Token:", accessToken);
  }, [accessToken]);
  return (
    <>
      <Head>
        <title>eKudo - Slack</title>
        <meta
          name="description"
          content="You are not authorised to access previous page."
        />
      </Head>
      <NavigationBarContent>Unauthorised</NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>
      <main className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-3xl">
          Well done, you succesfully gave permissions to Slack to send
          kudo&apos;s. This is your token: ${accessToken}
        </div>
        <div className="text-3xl">
          Open Slack again and use /kudo to send your first kudo!
        </div>
      </main>
    </>
  );
};

export default Slack;
