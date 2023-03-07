import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import Session from "~/Sessions/Session";

const Home: NextPage = () => {
  const sessions = ["Today", 1, 2, "Yesterday", 3, 4, 5, 6, "26/02/2023", 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
        <div className="flex flex-wrap gap-8 h-full justify-center p-5">
          {sessions.map((x) => (
            typeof (x) == 'string' ? <h1 className="justify-center w-full text-center text-3xl underline" key={x}>{x}</h1> : <Session id={x} key={x} />
          ))}
        </div>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Home;