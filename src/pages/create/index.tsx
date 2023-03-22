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
  type: string,
}

type User = {
  businessPhones: string[],
  displayName: string,
  givenName: string,
  jobTitle: string,
  mail: string,
  mobilePhone: string,
  officeLocation: string,
  preferredLanguage: string,
  surname: string,
  userPrincipalName: string,
  id: string,
  type: string
}


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
    const visible = users.filter(x => (x.mail !== me)).filter(x => (sessions.filter(x => x.Title.toLowerCase().includes(session?.Title.toLowerCase() ?? ""))).map(x => x.SpeakerId).includes(x.id))
    if (visible.length === 1 && speaker !== visible[0]) {
      setSpeaker(visible[0]);
    }
    return visible
  }

  const visibibleSessions = sessions.filter(session => speaker ? speaker.id === session.SpeakerId : true)

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
        <Select data-cy="SelectSession" value={session?.Title} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSession(sessions.find(s => s.Title === e.target.value))} label="Session" options={visibibleSessions} displayLabel="Title" valueLabel="Id" />
        <FcPodiumWithSpeaker size={100} />
        <Select data-cy="SelectSpeaker" value={speaker?.displayName} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSpeaker(users.find(u => u.displayName === e.target.value))} label="Speaker" options={visibleSpeakers()} displayLabel="displayName" valueLabel="id" />
        <label className="label cursor-pointer gap-5">
          <input type="checkbox" className="checkbox" />
          <span className="label-text">Hide my name.</span>
        </label>
      </main>
      <FAB text={"Next"} icon={<GrNext />} url="/geenUrl" urlWithParams={{ pathname: "/create/templates", query: { session: session?.Title, speaker: speaker?.displayName }, auth: null, hash: null, host: null, hostname: null, href: "/create/templates", path: null, protocol: null, search: null, slashes: null, port: null }} />
    </>
  );
};

export default New;