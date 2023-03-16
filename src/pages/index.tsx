import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import Session from "~/sessions/Session";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { FiSearch } from "react-icons/fi";
import { BiSortDown } from "react-icons/bi";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import NavButtons from "~/navigation/NavButtons";
import { trpc } from '~/utils/trpc';

type session = {
  id: number,
  title: string,
  date: string,
  speakerId: string,
}

const Home: NextPage = () => {
  const result = trpc.sessions.getAll.useQuery().data
  if (!result) {
    return <div>Loading...</div>;
  }
  const sessions: session[] = result.sessions
  console.log(sessions);
  
  sessions.map((s) => console.log(`${s.id} ${s.date.toString()}`));

  const dates = new Set(sessions.map((s) => s.date).sort((a,b) => a>=b?1:-1))
  console.log(dates);
  

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
        <div className="flex flex-wrap gap-8 h-full justify-center p-5">
          {sessions.map((x) => (
            <Session session={x} key={x.id} />
          ))}

          {/* {sessions.map((x) => (
            typeof (x) == 'string' ? <h1 className="justify-center w-full text-center text-3xl underline" key={x}>{x}</h1> : <Session session={x} key={x.Id} />
          ))} */}
        </div>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Home;