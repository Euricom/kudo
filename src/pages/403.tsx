import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import SessionList from "~/components/sessions/SessionList";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import LoadingBar from "~/components/LoadingBar";
import Link from "next/link";


const Unauthorised: NextPage = () => {
  const userId = useSession().data?.user.id

  const sessionsQuery = api.sessions.getSessionsBySpeaker.useQuery({ id: userId ?? "error" })
  const sessions = sessionsQuery.data
  if (sessionsQuery.isLoading || !sessions) {
    return <LoadingBar />;
  }

  return (
    <>
      <NavigationBarContent>
        Unauthorised
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent >
      <main className="flex flex-col gap-4 items-center justify-center h-full">
        <p className="text-3xl">403 | Unauthorised</p>
        <Link href={"/"} className="btn btn-accent">Go home</Link>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Unauthorised;