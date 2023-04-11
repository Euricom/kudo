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
import { type sortPosibillities } from "~/types";
export function getServerSideProps(context: { query: { searchtext: string, sort: sortPosibillities } }) {

  return {
    props: {
      filter: context.query.searchtext ?? "",
      sortIn: context.query.sort ?? "",
    }
  }
}

const All: NextPage<{ filter: string, sort: sortPosibillities }> = ({ filter, sort }) => {
  const sessions = api.sessions.getAll.useQuery().data

  if (!sessions) {
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
      <main className="flex flex-col items-center justify-center h-full">
        <SessionList sessions={sessions} filterIn={filter} sortIn={sort} />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default All;

