import { type NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";
import SpeakerCard from "~/components/speaker/SpeakerCard";
import SortAndFilter from "~/components/input/SortAndFilter";
import { UserRole, sortPosibillities } from "~/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const All: NextPage = () => {
  const router = useRouter()
  const user = useSession().data?.user

  const usersQuery = api.users.getRelevantUsers.useQuery()
  const users = usersQuery.data


  const [sort, setSort] = useState<sortPosibillities>(sortPosibillities.SpeakerA)

  useEffect(() => {
    if(user?.role !== UserRole.ADMIN) 
      router.replace("/403").catch(console.error)
  }, [user, router])

  if (!users || usersQuery.isLoading) {
    return <LoadingBar />;
  }

  const sortedUsers = () => {
    const sorted = users
    if (sort === sortPosibillities.SpeakerD) {
      return [...sorted].reverse()
    }
    return sorted
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
      <main className="flex flex-col items-center justify-center h-full ">
          <SortAndFilter setSort={setSort} />
          <div className="flex flex-wrap gap-4 h-full justify-center w-fit">
            {sortedUsers().map((u) => <SpeakerCard key={u.user.id} user={u} />)}
          </div>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default All;

