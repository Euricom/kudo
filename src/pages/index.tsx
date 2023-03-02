import { type NextPage } from "next";
import Head from "next/head";
import Kudo from "~/components/Kudo";
import NavBar from "~/navigation/NavBar";
import NavButtons from "~/navigation/NavButtons";

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
        <main className="flex h-full flex-col items-center justify-center">
          <Kudo />
        </main>
      </NavBar>
    </>
  );
};

export default Home;