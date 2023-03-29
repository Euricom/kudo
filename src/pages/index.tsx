import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { FiSearch } from "react-icons/fi";
import { BiSortDown } from "react-icons/bi";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import NavButtons from "~/navigation/NavButtons";
import SessionList from "~/sessions/SessionList";
import { api } from "~/utils/api";
import { type Session } from "~/types";
import { useSession } from "next-auth/react";


const Home: NextPage = () => {
  const userId: string | undefined = useSession().data?.user.id

  const speaker = api.users.getUserById.useQuery({ id: "cdb23f58-65db-4b6b-b132-cf2d13d08e76" })

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
        <button className="btn btn-ghost btn-circle">
          <FiSearch size={20} />
        </button>
        <button className="btn btn-ghost btn-circle">
          <BiSortDown size={20} />
        </button>
      </UtilButtonsContent>
      <main className="flex flex-col items-center justify-center h-full">
        <SessionList sessions={sessions} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Home;