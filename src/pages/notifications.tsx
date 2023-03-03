import { type NextPage } from "next";
import Head from "next/head";
import NavBar from "~/navigation/NavBar";
import NavButtons from "~/navigation/NavButtons";

const Notifications: NextPage = () => {
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar
        titleContent={
          "Notifications"
        }
      >
        <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
          Notifications
        </main>
      </NavBar>
    </>
  );
};

export default Notifications;