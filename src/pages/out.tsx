import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import NavBar from "~/navigation/NavBar";
import NavButtons from "~/navigation/NavButtons";
import { GrAdd } from 'react-icons/gr';

const Out: NextPage = () => {
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
            Out
        </main>
        <FAB text={"Create Kudo"} icon={<GrAdd />}/>
      </NavBar>
    </>
  );
};

export default Out;