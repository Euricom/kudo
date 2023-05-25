import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from "react-icons/gr";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";
import { type Filter, SortPosibillities, UserRole } from "~/types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SortAndFilter from "~/components/input/SortAndFilter";
import SpeakerCard from "~/components/speaker/SpeakerCard";
import { toast } from "react-toastify";
export function getServerSideProps(context: {
  query: { searchtext: string; sort: SortPosibillities };
}) {
  return {
    props: {
      searchtext: context.query.searchtext ?? "",
      sortIn: context.query.sort ?? "",
    },
  };
}

const Users: NextPage<{
  searchtext: string;
  sortIn: SortPosibillities;
  filterIn: Filter;
}> = ({ searchtext, sortIn }) => {
  const router = useRouter();
  const user = useSession().data?.user;

  const [sort, setSort] = useState<SortPosibillities>(
    sortIn ?? SortPosibillities.SpeakerA
  );
  const [search, setSearch] = useState<string>(searchtext ?? "");
  const query = router.query;

  const usersQuery = api.users.getRelevantUsers.useQuery();
  const { data: users } = usersQuery;

  useEffect(() => {
    if (user?.role !== UserRole.ADMIN)
      router.replace("/403").catch((e) => toast.error((e as Error).message));
  }, [user, router]);

  if (!users || usersQuery.isLoading) {
    return <LoadingBar />;
  }

  const sortedUsers = () => {
    const sorted = users;
    if (sort === SortPosibillities.SpeakerD) {
      return [...sorted].reverse();
    }
    return sorted;
  };

  return (
    <>
      <Head>
        <title>eKudo - All</title>
        <meta name="description" content="Admin page to view all users." />
      </Head>
      <NavigationBarContent>
        <></>
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>
      <main className="flex h-full flex-col items-center justify-start ">
        <div className="mt-4 flex gap-3">
          <span className="badge-accent badge">By user</span>
          <span
            className="badge-secondary badge"
            onClick={() =>
              void router.replace({
                pathname: "/all/sessions",
                query: { ...query },
              })
            }
          >
            By session
          </span>
          <span
            className="badge-secondary badge"
            onClick={() =>
              void router.replace({
                pathname: "/all/flagged",
                query: { ...query },
              })
            }
          >
            Reported
          </span>
        </div>
        <SortAndFilter
          setSort={setSort}
          setFilter={setSearch}
          filter={search}
          sort={sort}
        />
        <div className="flex h-full w-full flex-wrap justify-start gap-8 p-5">
          {sortedUsers()
            .filter((user) =>
              user.user.displayName
                .toLowerCase()
                .includes(search?.toLowerCase())
            )
            .map((u) => (
              <SpeakerCard key={u.user.id} user={u} />
            ))}
        </div>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Users;
