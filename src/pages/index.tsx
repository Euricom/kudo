import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import NavButtons from "~/navigation/NavButtons";
import SessionList from "~/sessions/SessionList";
import { api } from "~/utils/api";
import { sortPosibillities, type Session } from "~/types";
import { useSession } from "next-auth/react";
import { useState } from "react"
import SortAndFilter from "~/input/SortAndFilter";


const Home: NextPage = () => {
  const userId: string | undefined = useSession().data?.user.id
  const [sort, setSort] = useState<sortPosibillities>(sortPosibillities.DateD)

  const sessions: Session[] | undefined = api.sessions.getSessionsBySpeaker.useQuery({ id: userId ?? "error" }).data
  if (!sessions) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavigationBarContent>
        <NavButtons />
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UtilButtonsContent>
        <SortAndFilter setSort={setSort} />
      </UtilButtonsContent>
      <main className="flex flex-col items-center overflow-y-scroll justify-center h-full">
        <SessionList sessions={sessions} sort={sort} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Home;