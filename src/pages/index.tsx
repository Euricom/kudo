import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { FiSearch } from "react-icons/fi";
import { BiSortDown } from "react-icons/bi";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import NavButtons from "~/navigation/NavButtons";
import { trpc } from '~/utils/trpc';
import SessionList from "~/sessions/SessionList";

type session = {
  id: number,
  title: string,
  date: string,
  speakerId: string,
}

const Home: NextPage = () => {
  const result = trpc.sessions.getSessionsBySpeaker.useQuery().data
  if (!result) {
    return <div>Loading...</div>;
  }
  const sessions: session[] = result.sessions

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