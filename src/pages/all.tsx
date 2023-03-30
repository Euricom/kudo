import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { FiSearch } from "react-icons/fi";
import { MdSort } from "react-icons/md";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import React from "react"
import SessionList from "~/components/sessions/SessionList";
import { api } from "~/utils/api";



const All: NextPage = () => {
  const sessions = api.sessions.getAll.useQuery().data
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
        <div className="flex w-full max-w-md bg-base-200 dark:bg-base-100 shadow-xl rounded-full items-center px-4">
          <FiSearch size={20} className=""/>
          <input type="text" placeholder={"Search..."} className="input w-full bg-transparent rounded-full p-3 focus:outline-none" />
        </div>
        <button className="btn btn-primary btn-circle">
          <MdSort size={20} />
        </button>
      </UtilButtonsContent>
      <main className="flex flex-col items-center justify-center h-full">
        <SessionList sessions={sessions} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default All;

