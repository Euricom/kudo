import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from "react-icons/gr";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";
import { SortPosibillities, UserRole } from "~/types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SortAndFilter from "~/components/input/SortAndFilter";
import KudoCard from "~/components/kudos/Kudo";
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

const Flagged: NextPage<{ searchtext: string; sortIn: SortPosibillities }> = ({
  searchtext,
  sortIn,
}) => {
  const router = useRouter();
  const user = useSession().data?.user;

  const [sort, setSort] = useState<SortPosibillities>(
    sortIn ?? SortPosibillities.SpeakerA
  );
  const [search, setSearch] = useState<string>(searchtext ?? "");

  const usersQuery = api.users.getRelevantUsers.useQuery();
  const usersWCount = usersQuery.data;
  const users = usersWCount?.map((u) => u.user);

  const sessionsQuery = api.sessions.getAll.useQuery();
  const sessions = sessionsQuery.data;

  const kudosQuery = api.kudos.getFlaggedKudos.useQuery();
  const { data: kudos, refetch: refetchKudos } = kudosQuery;
  const query = router.query;

  useEffect(() => {
    if (user?.role !== UserRole.ADMIN)
      router.replace("/403").catch((e) => toast.error((e as Error).message));
  }, [user, router]);

  useEffect(() => {
    refetchKudos().catch(console.error);
  }, [refetchKudos, sort]);

  if (
    !users ||
    usersQuery.isLoading ||
    !sessions ||
    sessionsQuery.isLoading ||
    !kudos ||
    kudosQuery.isLoading
  ) {
    return <LoadingBar />;
  }

  return (
    <>
      <Head>
        <title>eKudo - All</title>
        <meta
          name="description"
          content="Admin page to view all flagged Kudo's."
        />
      </Head>
      <NavigationBarContent>
        <></>
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>
      <main className="flex h-full flex-col items-center justify-start ">
        <div className="mt-4 flex gap-3">
          <span
            className="badge-secondary badge"
            onClick={() =>
              void router.replace({ pathname: "/all", query: { ...query } })
            }
          >
            By user
          </span>
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
          <span className="badge-accent badge">Flagged</span>
        </div>
        <SortAndFilter
          setSort={setSort}
          filter={search}
          setFilter={setSearch}
        />
        <div className="flex h-full w-fit flex-wrap justify-center gap-4">
          {kudos.length == 0 ? (
            <h1>No flagged Kudos yet</h1>
          ) : (
            kudos
              .filter(
                (k) =>
                  sessions
                    .find((s) => s.id === k.sessionId)
                    ?.title.toLowerCase()
                    .includes(search?.toLowerCase() ?? "") ||
                  usersWCount
                    ?.find(
                      (u) =>
                        u.user.id ===
                        sessions.find((s) => s.id === k.sessionId)?.speakerId
                    )
                    ?.user.displayName.toLowerCase()
                    .includes(search?.toLowerCase() ?? "")
              )
              .map((kudo) => <KudoCard key={kudo.id} kudo={kudo} />)
          )}
        </div>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Flagged;
