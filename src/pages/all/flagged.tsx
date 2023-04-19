import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";
import { SortPosibillities, UserRole } from "~/types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SortAndFilter from "~/components/input/SortAndFilter";
import KudoCard from "~/components/kudos/Kudo";
export function getServerSideProps(context: { query: { searchtext: string, sort: SortPosibillities } }) {

    return {
        props: {
            searchtext: context.query.searchtext ?? "",
            sortIn: context.query.sort ?? "",
        }
    }
}

const Flagged: NextPage<{ searchtext: string, sortIn: SortPosibillities }> = ({ searchtext, sortIn }) => {

    const router = useRouter()
    const user = useSession().data?.user

    const [, setSort] = useState<SortPosibillities>(sortIn ?? SortPosibillities.SpeakerA)
    const [search, setSearch] = useState<string>(searchtext ?? "")

    const usersQuery = api.users.getRelevantUsers.useQuery()
    const { data: users } = usersQuery

    const sessionsQuery = api.sessions.getAll.useQuery()
    const sessions = sessionsQuery.data

    const kudoQuery = api.kudos.getFlaggedKudos.useQuery();
    const kudos = kudoQuery.data
    const query = router.query

    useEffect(() => {
        if (user?.role !== UserRole.ADMIN)
            router.replace("/403").catch(console.error)
    }, [user, router])



    if (!users || usersQuery.isLoading || !sessions || sessionsQuery.isLoading || !kudos || kudoQuery.isLoading) {
        return <LoadingBar />;
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
                    <span className="badge badge-secondary" onClick={() => void router.replace({ pathname: "/all", query: { ...query } })}>By user</span>
                    <span className="badge badge-secondary" onClick={() => void router.replace({ pathname: "/all/sessions", query: { ...query } })}>By session</span>
                    <span className="badge badge-accent">Flagged</span>
                </div>
                <SortAndFilter setSort={setSort} filter={search} setFilter={setSearch} />
                <div className="flex flex-wrap gap-4 h-full justify-center w-fit">
                    {kudos.length == 0 ? <h1>No flagged Kudos yet</h1> :
                        kudos.filter(k => sessions.find(s => s.id === k.sessionId)?.title.toLowerCase().includes(search?.toLowerCase() ?? "") || users?.find(u => u.user.id === (sessions.find(s => s.id === k.sessionId)?.speakerId))?.user.displayName.toLowerCase().includes(search?.toLowerCase() ?? "")).map((kudo) => (
                            <KudoCard key={kudo.id} kudo={kudo} />
                        ))}
                </div>
            </main>
            <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
        </>
    );
};


export default Flagged;

