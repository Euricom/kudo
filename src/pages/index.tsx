import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import SessionList from "~/components/sessions/SessionList";
import { api } from "~/utils/api";
import { sortPosibillities, type Session } from "~/types";
import { useSession } from "next-auth/react";
import { useState } from "react"
import SortAndFilter from "~/input/SortAndFilter";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";


const Home: NextPage = () => {
  const userId: string | undefined = useSession().data?.user.id
  const [sort, setSort] = useState<sortPosibillities>(sortPosibillities.DateD)

  const sessions: Session[] | undefined = api.sessions.getSessionsBySpeaker.useQuery({ id: userId ?? "error" }).data
  if (!sessions) {
    return <div>Loading...</div>;
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
        <SortAndFilter setSort={setSort} />
        <SessionList sessions={sessions} sort={sort} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Home;