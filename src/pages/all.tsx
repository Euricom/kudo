import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import SessionList from "~/components/sessions/SessionList";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";
import { Filter, SortPosibillities, UserRole } from "~/types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SortAndFilter from "~/components/input/SortAndFilter";
import KudoCard from "~/components/kudos/Kudo";
import SpeakerCard from "~/components/speaker/SpeakerCard";
export function getServerSideProps(context: { query: { searchtext: string, sort: SortPosibillities } }) {

  return {
    props: {
      searchtext: context.query.searchtext ?? "",
      sortIn: context.query.sort ?? "",
    }
  }
}

const All: NextPage<{ searchtext: string, sortIn: SortPosibillities }> = ({ searchtext, sortIn }) => {

  const router = useRouter()
  const user = useSession().data?.user

  const usersQuery = api.users.getRelevantUsers.useQuery()
  const users = usersQuery.data

  const sessionsQuery = api.sessions.getAll.useQuery()
  const sessions = sessionsQuery.data

  const kudoQuery = api.kudos.getFlaggedKudos.useQuery();
  const kudos = kudoQuery.data

  const [sort, setSort] = useState<SortPosibillities>(sortIn ?? SortPosibillities.SpeakerA)
  const [search, setSearch] = useState<string>(searchtext ?? "")
  const [filter, setFilter] = useState<Filter>(Filter.User)

  useEffect(() => {
    if (user?.role !== UserRole.ADMIN)
      router.replace("/403").catch(console.error)
  }, [user, router])

  if (!users || usersQuery.isLoading || !sessions || sessionsQuery.isLoading || !kudos || kudoQuery.isLoading) {
    return <LoadingBar />;
  }

  const sortedUsers = () => {
    const sorted = users
    if (sort === SortPosibillities.SpeakerD) {
      return [...sorted].reverse()
    }
    return sorted
  }

  function getContent() {
    switch (filter) {
      case Filter.Session:
        if (!sessions) return <></>
        return (
          <>
            <SessionList sessions={sessions} />
          </>
        )
      case Filter.User:
        return (
          <>
            <SortAndFilter setSort={setSort} filter={search} setFilter={setSearch} />
            <div className="flex flex-wrap gap-4 h-full justify-center w-fit">
              {sortedUsers().filter(user => user.user.displayName.toLowerCase().includes(search?.toLowerCase())).map((u) => <SpeakerCard key={u.user.id} user={u} />)}
            </div>
          </>
        )
      case Filter.Flagged:
        if (!kudos || !sessions) return <></>
        return (
          <>
            <SortAndFilter setSort={setSort} filter={search} setFilter={setSearch} />
            <div className="flex flex-wrap gap-4 h-full justify-center w-fit">
              {kudos == undefined || kudos.length == 0 ? <h1>No flagged Kudos yet</h1> :
                kudos.filter(k => sessions.find(s => s.id == k.sessionId)?.title.toLowerCase().includes(filter?.toLowerCase() ?? "") || users?.find(u => u.user.id === (sessions.find(s => s.id == k.sessionId)?.speakerId))?.user.displayName.toLowerCase().includes(filter?.toLowerCase() ?? "")).map((kudo) => (
                  <KudoCard key={kudo.id} kudo={kudo} />
                ))}
            </div>
          </>
        )
    }
  }

  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationBarContent>
        <NavButtons />
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent >
      <main className="flex flex-col items-center justify-start h-full ">
        <div className="flex gap-3 mt-4">
          <span className={`badge ${filter === Filter.User ? "badge-accent" : "badge-secondary"}`} onClick={() => setFilter(Filter.User)}>By user</span>
          <span className={`badge ${filter === Filter.Session ? "badge-accent" : "badge-secondary"}`} onClick={() => setFilter(Filter.Session)}>By session</span>
          <span className={`badge ${filter === Filter.Flagged ? "badge-accent" : "badge-secondary"}`} onClick={() => setFilter(Filter.Flagged)}>Flagged</span>
        </div>
        {getContent()}
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};


export default All;

