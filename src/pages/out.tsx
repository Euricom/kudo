import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import KudoCard from "~/components/kudos/Kudo";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { FiSearch } from "react-icons/fi";
import { MdSort } from "react-icons/md";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";



const Out: NextPage = () => {

  const userId = useSession().data?.user.id
  if (!userId) {
    throw new Error("No user signed in")
  }
  const kudos = api.kudos.getKudosByUserId.useQuery({ id: userId }).data
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
        <div className="flex w-full max-w-md bg-neutral rounded-full items-center px-4">
          <FiSearch size={20} className=""/>
          <input type="text" placeholder={"Search..."} className="input w-full bg-transparent rounded-full p-3 focus:outline-none" />
        </div>
        <button className="btn btn-primary btn-circle">
          <MdSort size={20} />
        </button>
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