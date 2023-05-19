import { type NextPage } from "next";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import Head from "next/head";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

interface SlackProps {
  code?: string;
  state: string;
}
export function getServerSideProps(context: {
  query: { code?: string; state?: string };
}) {
  return {
    props: {
      code: context.query.code,
      state: context.query.state ?? "",
    },
  };
}
const Slack: NextPage<SlackProps> = ({ code, state }) => {
  const update = api.slack.updateUserWithAccessToken.useMutation();
  const userid = useSession().data?.user.id;
  console.log("1");

  useEffect(() => {
    if (userid && code) {
      console.log(userid);
      console.log(code);
      console.log(update);
      update
        .mutateAsync({
          code: code,
          userId: userid,
        })
        .catch(console.error);
    }
  }, [code, userid]);

  return (
    <>
      <Head>
        <title>eKudo - Slack</title>
        <meta
          name="description"
          content="You are not authorised to access previous page."
        />
      </Head>
      <NavigationBarContent>Permissions granted!</NavigationBarContent>
      <main className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-3xl">
          Well done, you succesfully gave permissions to Slack to send
          kudo&apos;s. This is your token: {code}
        </div>
        <div className="text-3xl">
          Open Slack again and use /kudo to send your first kudo!
        </div>
      </main>
    </>
  );
};

export default Slack;
