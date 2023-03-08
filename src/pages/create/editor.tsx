import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { FiSend } from "react-icons/fi"
import Canvas from "~/kudos/Canvas";

const Editor: NextPage = () => {

  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
        <div className="aspect-[3/2] bg-green-400 w-full max-w-5xl">
          <div className="kudo-header-container flex h-1/4 bg-red-500 items-center justify-center">
            <h1 className="kudo-header">Bedankt</h1>
          </div>
          <Canvas />
        </div>
      </main>
      <FAB text={"Send"} icon={<FiSend />} url="/out" />
    </>
  );
};

export default Editor;