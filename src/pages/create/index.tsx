import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr"
import { FcPodiumWithSpeaker, FcPodiumWithAudience } from "react-icons/fc"
import Select from "~/input/Select";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";


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

  const users = api.users.getAllUsers.useQuery().data
  const [session, setSession] = useState<string>("");
  const [speaker, setSpeaker] = useState<string>("");
  const me = useSession().data?.user.email

  const result: Result | undefined = api.sessions.getAll.useQuery().data
  if (!result || !users) {
    return <div>Loading...</div>;
  }
  const data: Session[] = result.sessions

  const visibleSpeakers = () => {
    const visible = users.filter(x => (x.mail !== me)).filter(x => (data.filter(x => x.Title.toLowerCase().includes(session.toLowerCase()))).map(x => x.SpeakerId).includes(x.id)).map(x => x.displayName)
    if (visible.length === 1 && speaker !== visible[0]) {
      setSpeaker(visible[0] ?? "");
    }
    return visible
  }
  const visibleSessions = () => {
    return data.filter(x => (users.filter(x => x.displayName.toLowerCase().includes(speaker.toLowerCase())).map(x => x.id).includes(x.SpeakerId))).map(x => x.Title)
  }
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
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full gap-4">
        <FcPodiumWithAudience size={100} />
        <Select data-cy="SelectSession" value={session} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSession(e.target.value)} label="Session" options={visibleSessions()} />
        <FcPodiumWithSpeaker size={100} />
        <Select data-cy="SelectSpeaker" value={speaker} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSpeaker(e.target.value)} label="Speaker" options={visibleSpeakers()} />
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