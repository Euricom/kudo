import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import KudoCard from "~/kudos/Kudo";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import NavButtons from "~/navigation/NavButtons";
import { useSession } from "next-auth/react";
import { FindAllKudosSortedByUserId } from "~/server/services/kudoService";
import { sortPosibillities } from "~/types";
import { useState } from "react"
import SortAndFilter from "~/input/SortAndFilter";

// export function getServerSideProps(context: { query: { sort: string }; }) {

//   return {
//     props: {
//       sort: context.query.sort,
//     }
//   }
// }

const Out: NextPage = () => {

  const [sort, setSort] = useState<sortPosibillities>(sortPosibillities.DateD)

  const userId = useSession().data?.user.id
  if (!userId) {
    throw new Error("No user signed in")
  }
  const kudos = FindAllKudosSortedByUserId(userId, sort)

  if (!userId) {
    return <div>Loading...</div>
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
        <div className="flex flex-wrap gap-5 h-full justify-center p-5">
          {kudos == undefined || kudos.length == 0 ? <h1>No Kudos Sent Yet</h1> :
            kudos.map((kudo) => (
              <KudoCard key={kudo.id} kudo={kudo} />
            ))}
        </div>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Out;