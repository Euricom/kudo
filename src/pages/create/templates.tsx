import { type NextPage } from "next";
import Head from "next/head";
import NavBar from "~/navigation/NavBar";
import NavButtons from "~/navigation/NavButtons";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr"

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
          Templates
        </main>
        <FAB text={"Next"} icon={<GrNext />} url="/create/editor" />
      </NavBar>
    </>
  );
};

export default Editor;