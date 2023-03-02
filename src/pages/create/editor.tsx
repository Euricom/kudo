import { type NextPage } from "next";
import Head from "next/head";
import NavBar from "~/navigation/NavBar";
import NavButtons from "~/navigation/NavButtons";

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
          <NavButtons />
        }
      >
        <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
            Editor
        </main>
      </NavBar>
    </>
  );
};

export default Editor;