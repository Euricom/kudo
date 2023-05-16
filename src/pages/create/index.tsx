import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrNext } from "react-icons/gr";
import { FcPodiumWithSpeaker, FcPodiumWithAudience } from "react-icons/fc";
import Select from "~/components/input/Select";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { type Session, type User } from "~/types";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import LoadingBar from "~/components/LoadingBar";

export function getServerSideProps(context: { query: { session: string } }) {
  return {
    props: {
      sess: context.query.session ?? "",
    },
  };
}

const New: NextPage<{ sess: string }> = ({ sess }) => {
  const users = api.users.getAllUsers.useQuery().data;
  const [session, setSession] = useState<Session>();
  const [speaker, setSpeaker] = useState<User>();
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const me = useSession().data?.user.id;

  const sessionsQuery = api.sessions.getAll.useQuery();
  const sessions = sessionsQuery.data;

  useEffect(() => {
    if (!sessionsQuery.isLoading && sessions) {
      setSession(sessions?.find((s) => s.id === sess));
    }
  }, [sess, sessions, sessionsQuery.isLoading]);

  if (sessionsQuery.isLoading || !sessions || !users) {
    return <LoadingBar />;
  }

  const visibleSpeakers = () => {
    const visible = users
      .filter((x) => x.id !== me)
      .filter((x) =>
        sessions
          .filter((x) =>
            x.title.toLowerCase().includes(session?.title.toLowerCase() ?? "")
          )
          .map((x) => x.speakerId)
          .some((s) => s.indexOf(x.id) >= 0)
      );
    if (visible.length === 1 && speaker !== visible[0]) {
      setSpeaker(visible[0]);
    }
    return visible;
  };

  const visibibleSessions = sessions
    .filter((ses) => !ses.speakerId.includes(me ?? ""))
    .filter((session) =>
      speaker ? session.speakerId.includes(speaker.id) : true
    );

  function onclick() {
    setAnonymous(!anonymous);
  }

  return (
    <>
      <Head>
        <title>eKudo - New Kudo</title>
        <meta
          name="description"
          content="Page where you can select a session to send a Kudo to."
        />
      </Head>
      <NavigationBarContent>
        <h1>New Kudo</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>

      <main className="flex flex-col items-center justify-center gap-4">
        <FcPodiumWithAudience size={100} />
        <Select
          data-cy="SelectSession"
          value={session?.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setSession(
              sessions.find((s) => s.title === e.target.value)
                ? sessions.find((s) => s.title === e.target.value)
                : {
                    id: "0",
                    title: e.target.value,
                    date: "0",
                    speakerId: ["no"],
                  }
            )
          }
          label="Session"
          options={visibibleSessions}
          displayLabel="title"
          valueLabel="id"
        />
        <FcPodiumWithSpeaker size={100} />
        <Select
          data-cy="SelectSpeaker"
          value={speaker?.displayName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setSpeaker(users.find((u) => u.displayName === e.target.value))
          }
          label="Speaker"
          options={visibleSpeakers()}
          displayLabel="displayName"
          valueLabel="id"
        />
        <label className="label cursor-pointer gap-5">
          <input
            type="checkbox"
            checked={anonymous}
            className="checkbox"
            onChange={onclick}
          />
          <span className="label-text">Hide my name.</span>
        </label>
      </main>
      <FAB
        text={"Next"}
        icon={<GrNext />}
        urlWithParams={{
          pathname: "/create/templates",
          query: {
            session: session?.id,
            anonymous: anonymous.toString(),
          },
          auth: null,
          hash: null,
          host: null,
          hostname: null,
          href: "/create/templates",
          path: null,
          protocol: null,
          search: null,
          slashes: null,
          port: null,
        }}
      />
    </>
  );
};

export default New;
