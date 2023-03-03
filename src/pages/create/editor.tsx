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
          "Editor"
        }
      >
        <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
          Editor
        </main>
        <FAB text={"Next"} icon={<GrNext />} url="/out" />
      </NavBar>
    </>
  );
};

export default Editor;