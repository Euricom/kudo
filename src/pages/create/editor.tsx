import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { FiSend } from "react-icons/fi"
import Kudo from "~/kudos/Kudo";
import { NavigationBarContent } from "~/navigation/NavBarTitle";

const Editor: NextPage = () => {
  return (
    <>
      <NavigationBarContent>
        <h1>Editor</h1>
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
        <Kudo id={1} />
      </main>
      <FAB text={"Send"} icon={<FiSend />} url="/out" />
    </>
  );
};

export default Editor;