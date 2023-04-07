import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import SessionList from "~/components/sessions/SessionList";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import LoadingBar from "~/components/LoadingBar";
import { useRouter } from "next/router";


const Home: NextPage = () => {
  const router = useRouter()
  const user = useSession().data?.user

  const sessionsQuery = api.sessions.getSessionsBySpeaker.useQuery({ id: user?.id ?? "error" })
  const sessions = sessionsQuery.data
  if (sessionsQuery.isLoading || !sessions || !user) {
    return <LoadingBar />;
  }

  if (sessions.length === 0) {
    router.replace("/out").catch(console.error)
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
        <SessionList sessions={sessions} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Home;