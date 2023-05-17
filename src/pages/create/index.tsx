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
import { useRouter } from "next/router";

export function getServerSideProps(context: {
  query: { filter: string; sort: SortPosibillities };
}) {
  return {
    props: {
      filterIn: context.query.filter ?? "",
      sortIn: context.query.sort ?? "",
    },
  };
}

const New: NextPage<{
  filterIn: string;
  sortIn: SortPosibillities;
}> = ({ filterIn, sortIn }) => {
  const users = api.users.getAllUsers.useQuery().data;
  const me = useSession().data?.user.id;
  const router = useRouter();
  const [sort, setSort] = useState<SortPosibillities>(
    sortIn ?? SortPosibillities.DateD
  );
  const [filter, setFilter] = useState<string>(filterIn ?? "");

  const sessionsQuery = api.sessions.getAll.useQuery();
  const sessions = sessionsQuery.data?.filter(
    (s) => !s.speakerId.includes(me ?? "")
  );

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
    if (!sessions) return;
    switch (sort) {
      case SortPosibillities.TitleA:
      case SortPosibillities.TitleD:
        return (
          <>
            <div className="w-full">
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
              <div key={s.speakerId} className="w-full">
                <h2 className="bg-base-300 p-2 dark:bg-secondary">
                  {speaker?.displayName}
                </h2>
                <div>
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
                <div key={d.date} className="w-full">
                  <h2 className="bg-base-300 p-2 dark:bg-secondary">
                    {sessionDate.toLocaleDateString() ==
                    new Date().toLocaleDateString()
                      ? "Today"
                      : sessionDate.toDateString()}
                  </h2>
                  <div>
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
        <div className="flex h-full w-full flex-col items-center justify-start gap-8 px-5 lg:w-1/2">
          {sortSessions()}
        </div>
      </main>
    </>
  );
};

const SessionListItem = ({ session }: { session: Session }) => {
  const router = useRouter();
  const speakers: User[] | undefined = api.users.getUserByIds.useQuery({
    ids: session.speakerId,
  }).data;

  if (!session || !speakers) {
    return <></>;
  }

  return (
    <>
      <button
        key={session.id}
        className="h-fit w-full border-t-2 border-secondary py-4"
        onClick={() =>
          void router.push({
            pathname: "/create/templates",
            query: { session: session.id },
          })
        }
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-left text-lg font-bold" data-cy="SessionTitle">
            {session.title}
          </h2>
          <div className="flex w-full items-center justify-between text-sm">
            <div className="flex flex-col gap-2">
              {speakers.map((speaker) => (
                <>
                  <div className="flex items-center gap-3">
                    <h3 className="">{speaker.displayName}</h3>
                  </div>
                </>
              ))}
            </div>
            <h3 className="badge-primary badge text-xs">
              {new Date(session.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h3>
          </div>
        </div>
      </button>
    </>
  );
};

export default New;
