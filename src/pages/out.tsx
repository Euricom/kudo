import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from "react-icons/gr";
import KudoCard from "~/components/kudos/Kudo";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import { useSession } from "next-auth/react";
import { FindAllKudosSortedByUserId } from "~/server/services/kudoService";
import { SortPosibillities } from "~/types";
import { useEffect, useState } from "react";
import SortAndFilter from "~/components/input/SortAndFilter";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";
import { type Kudo } from "@prisma/client";

export function getServerSideProps(context: {
  query: { searchtext: string; sort: SortPosibillities };
}) {
  return {
    props: {
      filterIn: context.query.searchtext ?? "",
      sortIn: context.query.sort ?? "",
    },
  };
}

const Out: NextPage<{ filterIn: string; sortIn: SortPosibillities }> = ({
  filterIn,
  sortIn,
}) => {
  const sessionQuery = api.sessions.getAll.useQuery();
  const sessions = sessionQuery.data;
  const userQuery = api.users.getAllUsers.useQuery();
  const users = userQuery.data;

  const [sort, setSort] = useState<SortPosibillities>(
    sortIn ?? SortPosibillities.DateD
  );
  const [filter, setFilter] = useState<string>(filterIn ?? "");

  const userId = useSession().data?.user.id;

  if (!userId) {
    throw new Error("No user signed in");
  }
  const kudoQuery = api.kudos.getKudosByUserId.useQuery({ id: userId });
  const kudos = kudoQuery.data;

  const [sortedKudos, setKudos] = useState<Kudo[]>(
    FindAllKudosSortedByUserId(sort, kudos, sessions, users)
  );
  useEffect(() => {
    setKudos(FindAllKudosSortedByUserId(sort, kudos, sessions, users));
  }, [userId, sort, kudos, sessions, users]);

  if (
    kudoQuery.isLoading ||
    sessionQuery.isLoading ||
    userQuery.isLoading ||
    !kudos ||
    !sessions ||
    !users
  ) {
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
      </UtilButtonsContent>
      <main className="flex flex-col items-center justify-start">
        <SortAndFilter
          setSort={setSort}
          filter={filter}
          setFilter={setFilter}
        />
        <div className="mb-8 flex flex-wrap justify-center gap-5 px-5 md:mb-28">
          {sortedKudos == undefined || sortedKudos.length == 0 ? (
            <h1>No Kudos Sent Yet</h1>
          ) : (
            sortedKudos
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
