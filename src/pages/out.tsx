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
import { pages, sortPosibillities } from "~/types";
import { useEffect, useState } from "react"
import SortAndFilter from "~/components/input/SortAndFilter";
import { api } from "~/utils/api";
import { useFilters } from "~/components/input/RememberFilter";

const Out: NextPage = () => {

  const sessions = api.sessions.getAll.useQuery().data
  const data = useFilters().data
  let index = -1
  if (data.pages.includes(pages.Out)) {
    index = data.pages.indexOf(pages.Out)
  }

  const [sort, setSort] = useState<sortPosibillities>(data.sorts[index] ?? sortPosibillities.DateD)
  const [filter, setFilter] = useState<string>(data.filters[index] ?? "")

  const userId = useSession().data?.user.id

  useEffect(() => {
    if (data.pages.includes(pages.Out)) {
      const index = data.pages.indexOf(pages.Out)
      setFilter(data.filters[index] ?? "")
      setSort(data.sorts[index] ?? sortPosibillities.DateD)

    }
  }, [data.pages, data.filters, data.sorts])

  if (!userId) {
    throw new Error("No user signed in")
  }
  const kudos = FindAllKudosSortedByUserId(userId, sort)

  if (!userId || !sessions) {
    return <div>Loading...</div>
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
        <SortAndFilter page={pages.Out} sort={sort} setSort={setSort} filter={filter} setFilter={setFilter} />
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