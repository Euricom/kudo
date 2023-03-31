import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import NavButtons from "~/navigation/NavButtons";
import React, { useState } from "react"
import SessionList from "~/sessions/SessionList";
import { api } from "~/utils/api";
import { sortPosibillities } from "~/types";
import SortAndFilter from "~/input/SortAndFilter";



const All: NextPage = () => {
  const sessions = api.sessions.getAll.useQuery().data

  const [sort, setSort] = useState<sortPosibillities>(sortPosibillities.DateD)





  if (!sessions) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavigationBarContent>
        <NavButtons />
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UtilButtonsContent>
        <SortAndFilter setSort={setSort} />
      </UtilButtonsContent>
      <main className="flex flex-col items-center justify-center h-full">
        <SessionList sessions={sessions} sort={sort} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default All;

