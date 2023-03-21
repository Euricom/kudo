import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr"
import { FcPodiumWithSpeaker, FcPodiumWithAudience } from "react-icons/fc"
import Select from "~/input/Select";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { useState } from "react";
import { api } from "~/utils/api";


type Session = {
  Id: number,
  Title: string,
  Date: string,
  SpeakerId: string,
}

type Result = {
  sessions: Session[]
}


const New: NextPage = () => {

  const speakers = api.users.getAllUsers.useQuery().data
  const [session, setSession] = useState<string>("");
  const [speaker, setSpeaker] = useState<string>("");

  const result: Result | undefined = api.sessions.getAll.useQuery().data
  if (!result || !speakers) {
    return <div>Loading...</div>;
  }
  const data: Session[] = result.sessions

  return (
    <>
      <NavigationBarContent>
        <h1>New</h1>
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full gap-5">
        <FcPodiumWithSpeaker size={100} />
        <Select data-cy="SelectSpeaker" value={speaker} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSpeaker(e.target.value)} label="Speaker" options={speakers.filter(x => (data.filter(x => x.Title.toLowerCase().includes(session.toLowerCase()))).map(x => x.SpeakerId).includes(x.id)).map(x => x.displayName)} />
        <FcPodiumWithAudience size={100} />
        <Select data-cy="SelectSession" value={session} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSession(e.target.value)} label="Session" options={data.filter(x => (speakers.filter(x => x.displayName.toLowerCase().includes(speaker.toLowerCase())).map(x => x.id).includes(x.SpeakerId))).map(x => x.Title)} />
        <label className="label cursor-pointer gap-5">
          <input type="checkbox" className="checkbox" />
          <span className="label-text">Hide my name.</span>
        </label>
      </main>
      <FAB text={"Next"} icon={<GrNext />} url="/geenUrl" urlWithParams={{ pathname: "/create/templates", query: { session: session, speaker: speaker }, auth: null, hash: null, host: null, hostname: null, href: "/create/templates", path: null, protocol: null, search: null, slashes: null, port: null }} />
    </>
  );
};

export default New;