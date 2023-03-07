import { type NextPage } from "next";
import Head from "next/head";
import NavBar from "~/navigation/NavBar";
import FAB from "~/navigation/FAB";
import { FiSend } from "react-icons/fi"
import Kudo from "~/components/Kudo";

const Editor: NextPage = () => {
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar
        titleContent={
          "Editor"
        }
      >
        <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
          <Kudo />
        </main>
        <FAB text={"Send"} icon={<FiSend />} url="/out" />
      </NavBar>
    </>
  );
};

export default Editor;