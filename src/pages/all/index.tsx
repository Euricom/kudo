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
import { Filter, ImageData, SortPosibillities, UserRole } from "~/types";
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

const Users: NextPage<{ searchtext: string, sortIn: SortPosibillities, filterIn: Filter }> = ({ searchtext, sortIn }) => {

    const router = useRouter()
    const user = useSession().data?.user

    const [sort, setSort] = useState<SortPosibillities>(sortIn ?? SortPosibillities.SpeakerA)
    const [search, setSearch] = useState<string>(searchtext ?? "")
    const query = router.query

    const usersQuery = api.users.getRelevantUsers.useQuery()
    const { data: users } = usersQuery

    useEffect(() => {
        if (user?.role !== UserRole.ADMIN)
            router.replace("/403").catch(console.error)
    }, [user, router])



    if (!users || usersQuery.isLoading) {
        return <LoadingBar />;
    }

    const sortedUsers = () => {
        const sorted = users
        if (sort === SortPosibillities.SpeakerD) {
            return [...sorted].reverse()
        }
        return sorted
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
                    <span className="badge badge-accent">By user</span>
                    <span className="badge badge-secondary" onClick={() => void router.replace({ pathname: "/all/sessions", query: { ...query } })}>By session</span>
                    <span className="badge badge-secondary" onClick={() => void router.replace({ pathname: "/all/flagged", query: { ...query } })}>Flagged</span>
                </div>
                <SortAndFilter setSort={setSort} filter={search} setFilter={setSearch} />
                <div className="flex flex-wrap gap-4 h-full justify-center w-fit">
                    {sortedUsers().filter(user => user.user.displayName.toLowerCase().includes(search?.toLowerCase())).map((u) => <SpeakerCard key={u.user.id} user={u} />)}
                </div>
            </main>
            <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
        </>
    );
};


export default Users;

