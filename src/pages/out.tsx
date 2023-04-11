import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import KudoCard from "~/components/kudos/Kudo";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import { useSession } from "next-auth/react";
import { FindAllKudosSortedByUserId } from "~/server/services/kudoService";
import { sortPosibillities } from "~/types";
import { useState } from "react"
import SortAndFilter from "~/components/input/SortAndFilter";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";

export function getServerSideProps(context: { query: { filter: string, sort: sortPosibillities }; }) {

  return {
    props: {
      filterIn: context.query.filter ?? "",
      sortIn: context.query.sort ?? "",
    }
  }
}

const Out: NextPage<{ filterIn: string, sortIn: sortPosibillities }> = ({ filterIn, sortIn }) => {

  const sessions = api.sessions.getAll.useQuery().data

  const [sort, setSort] = useState<sortPosibillities>(sortIn ?? sortPosibillities.DateD)
  const [filter, setFilter] = useState<string>(filterIn ?? "")

  const userId = useSession().data?.user.id

  if (!userId) {
    throw new Error("No user signed in")
  }
  const kudos = FindAllKudosSortedByUserId(userId, sort)

  if (!userId || !sessions) {
    return <LoadingBar />
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
      <main className="flex flex-col items-center justify-start">
        <SortAndFilter sort={sort} setSort={setSort} filter={filter} setFilter={setFilter} />
        <div className="flex flex-wrap gap-5 justify-center px-5 mb-8 md:mb-28">
          {kudos == undefined || kudos.length == 0 ? <h1>No Kudos Sent Yet</h1> :
            kudos.filter(k => sessions.find(s => s.id == k.sessionId)?.title.toLowerCase().includes(filter?.toLowerCase() ?? "")).map((kudo) => (
              <KudoCard key={kudo.id} kudo={kudo} />
            ))}
        </div>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Out;