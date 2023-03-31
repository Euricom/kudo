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
        <div className="w-full lg:w-1/2 p-5 z-40 flex justify-center gap-2 mx-auto">
          <div className="flex w-full max-w-md bg-base-100 shadow-xl rounded-full items-center px-4">
            <FiSearch size={20} className="" />
            <input type="text" placeholder={"Search..."} className="input w-full bg-transparent rounded-full p-3 focus:outline-none" />
          </div>
          <button className="btn btn-primary btn-circle">
            <MdSort size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-5 justify-center px-5 mb-8 md:mb-28">
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