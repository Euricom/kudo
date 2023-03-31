import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { FiSearch } from "react-icons/fi";
import { MdSort } from "react-icons/md";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import SessionList from "~/components/sessions/SessionList";
import { api } from "~/utils/api";
import { type Session } from "~/types";
import { useSession } from "next-auth/react";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";


const Home: NextPage = () => {
  const userId: string | undefined = useSession().data?.user.id

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
      </UtilButtonsContent>
      <main className="flex flex-col items-center justify-start h-full">
        <div className="w-full lg:w-1/2 p-5 z-40 flex justify-center gap-2 mx-auto">
          <div className="flex w-full max-w-md bg-base-100 shadow-xl rounded-full items-center px-4">
            <FiSearch size={20} className="" />
            <input type="text" placeholder={"Search..."} className="input w-full bg-transparent rounded-full p-3 focus:outline-none" />
          </div>
          <button className="btn btn-primary btn-circle">
            <MdSort size={20} />
          </button>
        </div>
        <SessionList sessions={sessions} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Home;