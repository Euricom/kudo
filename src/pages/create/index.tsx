import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrNext } from "react-icons/gr"
import { FcPodiumWithSpeaker, FcPodiumWithAudience } from "react-icons/fc"
import Select from "~/components/input/Select";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";


import { type Session, type User } from "~/types";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";


const New: NextPage = () => {

  const users = api.users.getAllUsers.useQuery().data
  const [session, setSession] = useState<Session>();
  const [speaker, setSpeaker] = useState<User>();
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const me = useSession().data?.user.id


  const adil = api.users.getUserImageById.useQuery({ id: "cdb23f58-65db-4b6b-b132-cf2d13d08e76" })
  console.log(adil);
  console.log(adil.data);



  const sessions: Session[] | undefined = api.sessions.getAll.useQuery().data
  if (!sessions || !users || !adil) {
    return <div>Loading...</div>;
  }

  const visibleSpeakers = () => {
    const visible = users.filter(x => (x.id !== me)).filter(x => (sessions.filter(x => x.title.toLowerCase().includes(session?.title.toLowerCase() ?? ""))).map(x => x.speakerId).includes(x.id))
    if (visible.length === 1 && speaker !== visible[0]) {
      setSpeaker(visible[0]);
    }
    return visible
  }

  const visibibleSessions = sessions.filter(ses => ses.speakerId !== me).filter(session => speaker ? speaker.id === session.speakerId : true)



  function onclick() {
    setAnonymous(!anonymous)
  }

  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationBarContent>
        <h1>New</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>
      <main className="flex flex-col items-center justify-center gap-4">
        <FcPodiumWithAudience size={100} />
        <Select data-cy="SelectSession" value={session?.title} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSession(sessions.find(s => s.title === e.target.value) ? sessions.find(s => s.title === e.target.value) : { id: "0", title: e.target.value, date: "0", speakerId: "no" })} label="Session" options={visibibleSessions} displayLabel="title" valueLabel="id" />
        <FcPodiumWithSpeaker size={100} />
        <Select data-cy="SelectSpeaker" value={speaker?.displayName} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSpeaker(users.find(u => u.displayName === e.target.value))} label="Speaker" options={visibleSpeakers()} displayLabel="displayName" valueLabel="id" />
        <label className="label cursor-pointer gap-5">
          <input type="checkbox" checked={anonymous} className="checkbox" onChange={onclick} />
          <span className="label-text">Hide my name.</span>
        </label>
      </main>
      <FAB text={"Next"} icon={<GrNext />} urlWithParams={{ pathname: "/create/templates", query: { session: session?.id, speaker: speaker?.displayName, anonymous: anonymous.toString() }, auth: null, hash: null, host: null, hostname: null, href: "/create/templates", path: null, protocol: null, search: null, slashes: null, port: null }} />
    </>
  );
};

export default New;