import { type NextPage } from "next";
import Head from "next/head";
import { NavigationBarContent } from "~/navigation/NavBarTitle";

const KudoDetail: NextPage = () => {
  return (
    <>
      <NavigationBarContent>
        <h1>Kudo [ID]</h1>
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full" data-cy="Kudo">
        KudoDetail
      </main>
    </>
  );
};

export default KudoDetail;