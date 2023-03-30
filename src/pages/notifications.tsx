import { type NextPage } from "next";
import Head from "next/head";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";

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
      <main className="flex flex-col items-center justify-center h-full">
        Notifications
      </main>
    </>
  );
};

export default Notifications;