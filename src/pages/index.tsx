import { type NextPage } from "next";
import Head from "next/head";
import Kudo from "~/components/Kudo";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-full flex-col items-center justify-center">
        <Kudo />
      </main>
    </>
  );
};

export default Home;