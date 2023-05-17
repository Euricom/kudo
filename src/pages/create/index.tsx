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
import { SortPosibillities, type Session, type User } from "~/types";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import LoadingBar from "~/components/LoadingBar";
import SortAndFilter from "~/components/input/SortAndFilter";
import {
  sortDate,
  sortSpeaker,
  sortTitle,
} from "~/server/services/sessionService";

export function getServerSideProps(context: {
  query: { session: string; filter: string; sort: SortPosibillities };
}) {
  return {
    props: {
      sess: context.query.session ?? "",
      filterIn: context.query.filter ?? "",
      sortIn: context.query.sort ?? "",
    },
  };
}

const New: NextPage<{
  sess: string;
  filterIn: string;
  sortIn: SortPosibillities;
}> = ({ sess, filterIn, sortIn }) => {
  const users = api.users.getAllUsers.useQuery().data;
  const [session, setSession] = useState<Session>();
  const me = useSession().data?.user.id;
  const [sort, setSort] = useState<SortPosibillities>(
    sortIn ?? SortPosibillities.DateD
  );
  const [filter, setFilter] = useState<string>(filterIn ?? "");

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

  function filtering(sessions: Session[]) {
    return sessions.filter(
      (s) =>
        new Date(s.date)
          .toLocaleString("en-GB", { month: "long" })
          .toLowerCase()
          .includes(filter?.toLowerCase() ?? "") ||
        new Date(s.date)
          .toLocaleString("nl-NL", { month: "long" })
          .toLowerCase()
          .includes(filter?.toLowerCase() ?? "") ||
        new Date(s.date)
          .toLocaleDateString("en-GB")
          .toLowerCase()
          .includes(filter?.toLowerCase() ?? "") ||
        new Date(s.date)
          .toDateString()
          .toLowerCase()
          .includes(filter?.toLowerCase() ?? "") ||
        s.title.toLowerCase().includes(filter?.toLowerCase() ?? "") ||
        users
          ?.find((u) => s.speakerId.includes(u.id))
          ?.displayName.toLowerCase()
          .includes(filter?.toLowerCase() ?? "")
    );
  }
  function sortSessions() {
    switch (sort) {
      case SortPosibillities.TitleA:
      case SortPosibillities.TitleD:
        return (
          <>
            <div className="flex w-full flex-wrap gap-4">
              {filtering(sortTitle({ sessions: sessions, sort: sort })).map(
                (s) => (
                  <SessionListItem key={s.id} session={s} />
                )
              )}
            </div>
          </>
        );
      case SortPosibillities.SpeakerA:
      case SortPosibillities.SpeakerD:
        return sortSpeaker({
          sessions: filtering(sessions).sort((a, b) =>
            (users?.find((u) => a.speakerId.includes(u.id))?.displayName ??
              "a") >
            (users?.find((u) => b.speakerId.includes(u.id))?.displayName ?? "b")
              ? 1
              : -1
          ),
          sort: sort,
        }).map((s) => {
          const speaker = users?.find((u) => u.id === s.speakerId);
          return (
            <>
              <div key={s.speakerId} className="w-full md:w-fit ">
                <h2 className="w-full">{speaker?.displayName}</h2>
                <div className="flex flex-wrap gap-4">
                  {s.sessions.map((s) => {
                    return <SessionListItem key={s.id} session={s} />;
                  })}
                </div>
              </div>
            </>
          );
        });
      default:
        return sortDate({ sessions: filtering(sessions), sort: sort }).map(
          (d) => {
            const sessionDate = new Date(d.date);
            return (
              <>
                <div key={d.date} className="w-full md:w-fit">
                  <h2 className="w-full">
                    {sessionDate.toLocaleDateString() ==
                    new Date().toLocaleDateString()
                      ? "Today"
                      : sessionDate.toDateString()}
                  </h2>
                  <div className="flex w-full flex-wrap gap-4">
                    {d.sessions.map((s) => {
                      return <SessionListItem key={s.id} session={s} />;
                    })}
                  </div>
                </div>
              </>
            );
          }
        );
    }
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
        <SortAndFilter
          setSort={setSort}
          setFilter={setFilter}
          filter={filter}
          sort={sort}
        />
        <div className="flex h-full w-full flex-col items-center justify-start gap-8 p-5">
          {sortSessions()}
        </div>
      </main>
    </>
  );
};

const SessionListItem = ({ session }: { session: Session }) => {
  const speakers: User[] | undefined = api.users.getUserByIds.useQuery({
    ids: session.speakerId,
  }).data;

  if (!session || !speakers) {
    return <></>;
  }

  return (
    <>
      <li
        key={session.id}
        className="card h-fit w-full bg-base-100 shadow-xl md:w-96"
        data-cy="Session"
        data-title={session.id}
      >
        <div className="card-body">
          <h2 className="card-title text-2xl" data-cy="SessionTitle">
            {session.title}
          </h2>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-2">
              {speakers.map((speaker) => (
                <>
                  <div className="flex items-center gap-3">
                    <h3 className="">{speaker.displayName}</h3>
                  </div>
                </>
              ))}
            </div>
            <h3 className="badge-primary badge">
              {new Date(session.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h3>
          </div>
        </div>
      </li>
    </>
  );
};

export default New;
