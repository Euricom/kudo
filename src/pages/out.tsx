import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from "react-icons/gr";
import KudoCard from "~/components/kudos/Kudo";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { useSession } from "next-auth/react";
import { SortPosibillities } from "~/types";
import { useEffect, useState } from "react";
import SortAndFilter from "~/components/input/SortAndFilter";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";

export function getServerSideProps(context: {
  query: { searchtext: string; sort: SortPosibillities };
}) {
  return {
    props: {
      filterIn: context.query.searchtext ?? null,
      sortIn: context.query.sort ?? null,
    },
  };
}

const Out: NextPage<{ filterIn: string; sortIn: SortPosibillities }> = ({
  filterIn,
  sortIn,
}) => {
  const [sort, setSort] = useState<SortPosibillities>(
    sortIn === null ? SortPosibillities.DateD : sortIn
  );
  const [filter, setFilter] = useState<string>(
    filterIn === null ? "" : filterIn
  );

  const sessionsQuery = api.sessions.getAll.useQuery();
  const sessions = sessionsQuery.data;
  const usersQuery = api.users.getAllUsers.useQuery();
  const users = usersQuery.data;
  const user = useSession().data?.user;

  if (!user?.id) {
    throw new Error("No user signed in");
  }
  const kudosQuery = api.kudos.getKudosByUserId.useQuery({
    id: user.id,
    sort: sort,
  });
  const { data: kudos, refetch: refetchKudos } = kudosQuery;

  useEffect(() => {
    refetchKudos().catch(console.error);
  }, [refetchKudos, sort]);

  if (
    kudosQuery.isLoading ||
    sessionsQuery.isLoading ||
    usersQuery.isLoading ||
    !sessions ||
    !kudos ||
    !users
  ) {
    return <LoadingBar />;
  }

  return (
    <>
      <Head>
        <title>eKudo - Out</title>
        <meta
          name="description"
          content="Page where you can see the Kudo's you've send."
        />
      </Head>
      <NavigationBarContent>
        <></>
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>
      <main className="flex flex-col items-center justify-start">
        <SortAndFilter
          setSort={setSort}
          setFilter={setFilter}
          filter={filter}
          sort={sort}
        />
        <div className="mb-8 flex flex-wrap justify-center gap-5 px-5 md:mb-28">
          {kudos.length == 0 ? (
            <h1>No Kudos Sent Yet</h1>
          ) : (
            kudos
              .filter(
                (k) =>
                  sessions
                    .find((s) => s.id == k.sessionId)
                    ?.title.toLowerCase()
                    .includes(filter?.toLowerCase() ?? "") ||
                  users
                    .find(
                      (u) =>
                        u.id ===
                        sessions.find((s) => s.id == k.sessionId)?.speakerId
                    )
                    ?.displayName.toLowerCase()
                    .includes(filter?.toLowerCase() ?? "")
              )
              .map((kudo) => <KudoCard key={kudo.id} kudo={kudo} />)
          )}
        </div>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Out;
