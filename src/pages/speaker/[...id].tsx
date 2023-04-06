import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { api } from "~/utils/api";
import SessionList from "~/components/sessions/SessionList";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from "react-icons/gr";
import LoadingBar from "~/components/LoadingBar";

export function getServerSideProps(context: { query: { id: string } }) {
  return {
    props: {
      id: context.query.id[0],
    },
  };
}

const Speaker: NextPage<{ id: string }> = ({ id }) => {
  const sessionsQuery = api.sessions.getSessionsBySpeaker.useQuery({ id: id ?? "error" })
  const sessions = sessionsQuery.data
  
  const speaker = api.users.getUserById.useQuery({ id: id }).data

  if (sessionsQuery.isLoading||!sessions) {
    return <LoadingBar />;
  }

  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationBarContent>
        Sessions: {speaker?.displayName} 
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent >
      <main className="flex flex-col items-center justify-center h-full">
        <SessionList sessions={sessions} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Speaker;
