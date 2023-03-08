import { type NextPage } from "next";
import Head from "next/head";
import { NavigationBarContent } from "~/navigation/NavBarTitle";

const Notifications: NextPage = () => {
  return (
    <>

      <NavigationBarContent>
        <h1>Notifications </h1>
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
        Notifications
      </main>
    </>
  );
};

export default Notifications;