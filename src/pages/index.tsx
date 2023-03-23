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
import { type User, type Session } from "~/types";
import { useSession } from "next-auth/react";


const Home: NextPage = () => {
  const me = useSession().data?.user.email
  const user: User | undefined = api.users.getUserByEmail.useQuery({ id: me ?? "error" }).data

  const sessions: Session[] | undefined = api.sessions.getSessionsBySpeaker.useQuery({ id: user?.id ?? "error" }).data
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
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
        <SessionList sessions={sessions} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Home;