import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import Kudo from "~/Kudos/Kudo";
import { GrNext } from "react-icons/gr"

const Editor: NextPage = () => {
  const kudos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
        <div className="flex flex-wrap gap-5 h-full justify-center p-5">
          {kudos.map((x) => (
            <Kudo key={x} />
          ))}
        </div>
      </main>
      <FAB text={"Next"} icon={<GrNext />} url="/create/editor" />
    </>
  );
};

export default Editor;