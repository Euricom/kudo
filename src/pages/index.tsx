import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import SessionList from "~/components/sessions/SessionList";
import { api } from "~/utils/api";
import { type Session } from "~/types";
import { useSession } from "next-auth/react";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import LoadingBar from "~/components/LoadingBar";


export function getServerSideProps(context: { query: { filter: string }; }) {

  return {
    props: {
      filter: context.query.filter ?? ""
    }
  }
}

const Home: NextPage<{ filter: string }> = ({ filter }) => {
  const userId: string | undefined = useSession().data?.user.id

  const sessions: Session[] | undefined = api.sessions.getSessionsBySpeaker.useQuery({ id: userId ?? "error" }).data
  if (!sessions) {
    return <LoadingBar />
  }

  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationBarContent>
        <NavButtons />
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent >
      <main className="flex flex-col items-center justify-center h-full">
        <SessionList sessions={sessions} filterIn={filter} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Home;