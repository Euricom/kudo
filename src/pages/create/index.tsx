import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr"
import { FcPodiumWithSpeaker, FcPodiumWithAudience } from "react-icons/fc"
import Select from "~/input/Select";

const New: NextPage = () => {
  const speakers = ["Steve Jobs", "Bill Gates", "Steven Universe"];
  const sessions = ["Ted talk 1", "Gaming", "???"];
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main className="flex flex-col items-center justify-center overflow-y-scroll h-full gap-5">
          <FcPodiumWithSpeaker size={100} />
          <Select label="Speaker" options={speakers} />
          <FcPodiumWithAudience size={100} />
          <Select label="Session" options={sessions} />
          <label className="label cursor-pointer gap-5">
            <input type="checkbox" className="checkbox" />
            <span className="label-text">Hide my name.</span>
          </label>
        </main>
        <FAB text={"Next"} icon={<GrNext />} url="/create/templates" />
    </>
  );
};

export default New;