import { type NextPage } from "next";
import Head from "next/head";
import Kudo from "~/components/Kudo";
import FAB from "~/navigation/FAB";
import NavBar from "~/navigation/NavBar";
import NavButtons from "~/navigation/NavButtons";
import { GrAdd } from 'react-icons/gr';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar
        titleContent={
          <NavButtons />
        }
      >
        <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
          <div className="flex flex-wrap gap-5 h-full justify-around p-5">
            <Kudo />
            <Kudo />
            <Kudo />
            <Kudo />
            <Kudo />
            <Kudo />
            <Kudo />
            <Kudo />
            <Kudo />
            <Kudo />
          </div>
        </main>
        <FAB text={"Create Kudo"} icon={<GrAdd />}/>
      </NavBar>
    </>
  );
};

export default Home;