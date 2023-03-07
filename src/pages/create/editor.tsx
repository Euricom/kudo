import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr"
import Kudo from "~/components/Kudo";

const Editor: NextPage = () => {
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
          <Kudo />
        </main>
        <FAB text={"Next"} icon={<GrNext />} url="/out" />
    </>
  );
};

export default Editor;