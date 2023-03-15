import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import KudoCard from "~/kudos/Kudo";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { FiSearch } from "react-icons/fi";
import { BiSortDown } from "react-icons/bi";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import NavButtons from "~/navigation/NavButtons";
import { useSession } from "next-auth/react";
import { trpc } from "~/utils/trpc";



const Out: NextPage = () => {

  const userId = useSession().data?.user.id
  if (!userId) {
    throw new Error("No user signed in")

  }
  const kudos = trpc.kudos.getKudosByUserId.useQuery({ id: userId }).data


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
        <button className="btn btn-ghost btn-circle">
          <FiSearch size={20} />
        </button>
        <button className="btn btn-ghost btn-circle">
          <BiSortDown size={20} />
        </button>
      </UtilButtonsContent>
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
        <div className="flex flex-wrap gap-5 h-full justify-center p-5">
          {kudos == undefined ? <h1>No Kudos Sent Yet</h1> :
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