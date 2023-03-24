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


import { type Session, type User } from "~/types";


const New: NextPage = () => {

  const users = api.users.getAllUsers.useQuery().data
  const [session, setSession] = useState<Session>();
  const [speaker, setSpeaker] = useState<User>();
  const me = useSession().data?.user.email

  const sessions: Session[] | undefined = api.sessions.getAll.useQuery().data
  if (!sessions || !users) {
    return <div>Loading...</div>;
  }

  const visibleSpeakers = () => {
    const visible = users.filter(x => (x.mail !== me)).filter(x => (sessions.filter(x => x.title.toLowerCase().includes(session?.title.toLowerCase() ?? ""))).map(x => x.speakerId).includes(x.id))
    if (visible.length === 1 && speaker !== visible[0]) {
      setSpeaker(visible[0]);
    }
    return visible
  }

  const visibibleSessions = sessions.filter(session => speaker ? speaker.id === session.speakerId : true)



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
        <Select data-cy="SelectSession" value={session?.title} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSession(sessions.find(s => s.title === e.target.value) ? sessions.find(s => s.title === e.target.value) : { id: "0", title: e.target.value, date: "0", speakerId: "no" })} label="Session" options={visibibleSessions} displayLabel="title" valueLabel="id" />
        <FcPodiumWithSpeaker size={100} />
        <Select data-cy="SelectSpeaker" value={speaker?.displayName} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSpeaker(users.find(u => u.displayName === e.target.value))} label="Speaker" options={visibleSpeakers()} displayLabel="displayName" valueLabel="id" />
        <label className="label cursor-pointer gap-5">
          <input type="checkbox" className="checkbox" />
          <span className="label-text">Hide my name.</span>
        </label>
      </main>
      <FAB text={"Next"} icon={<GrNext />} url="/geenUrl" urlWithParams={{ pathname: "/create/templates", query: { session: session?.id, speaker: speaker?.displayName }, auth: null, hash: null, host: null, hostname: null, href: "/create/templates", path: null, protocol: null, search: null, slashes: null, port: null }} />
    </>
  );
};

export default New;