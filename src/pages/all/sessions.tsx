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
import { SortPosibillities, UserRole } from "~/types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
export function getServerSideProps(context: { query: { searchtext: string, sort: SortPosibillities } }) {

    return {
        props: {
            searchtext: context.query.searchtext ?? "",
            sortIn: context.query.sort ?? "",
        }
    }
}

const Sessions: NextPage<{ searchtext: string, sortIn: SortPosibillities }> = ({ searchtext, sortIn, }) => {

    const router = useRouter()
    const user = useSession().data?.user

    const [sort, setSort] = useState<SortPosibillities>(sortIn ?? SortPosibillities.SpeakerA)
    const [search, setSearch] = useState<string>(searchtext ?? "")

    const sessionsQuery = api.sessions.getAll.useQuery()
    const sessions = sessionsQuery.data
    const query = router.query

    useEffect(() => {
        if (user?.role !== UserRole.ADMIN)
            router.replace("/403").catch(console.error)
    }, [user, router])


    if (!sessions || sessionsQuery.isLoading) {
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
                    <span className="badge badge-accent">By session</span>
                    <span className="badge badge-secondary" onClick={() => void router.replace({ pathname: "/all/flagged", query: { ...query } })}>Flagged</span>
                </div>
                <SessionList sessions={sessions} filterIn={search} sortIn={sort} />
            </main>
            <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
        </>
    );
};


export default Sessions;

