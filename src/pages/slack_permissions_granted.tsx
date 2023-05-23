import { type NextPage } from "next";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import Head from "next/head";

interface SlackProps {
  code?: string;
  state: string;
}

const Slack: NextPage<SlackProps> = () => {
  return (
    <>
      <Head>
        <title>eKudo - Slack</title>
        <meta name="description" content="Permissions granted." />
      </Head>
      <NavigationBarContent>Permissions granted!</NavigationBarContent>
      <main className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-3xl">
          Well done, you succesfully gave permissions to Slack to send
          kudo&apos;s.
        </div>
        <div className="text-3xl">
          Open Slack again and use /kudo to send your first kudo!
        </div>
      </main>
    </>
  );
};

export default Slack;
