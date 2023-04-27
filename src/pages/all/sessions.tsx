import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from "react-icons/gr";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import NavButtons from "~/components/navigation/NavButtons";
import SessionList from "~/components/sessions/SessionList";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";
import { type SortPosibillities, UserRole } from "~/types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-toastify";
export function getServerSideProps(context: {
  query: { searchtext: string; sort: SortPosibillities };
}) {
  return {
    props: {
      searchtext: context.query.searchtext ?? "",
      sortIn: context.query.sort ?? "",
    },
  };
}

const Sessions: NextPage<{ searchtext: string; sortIn: SortPosibillities }> = ({
  searchtext,
  sortIn,
}) => {
  const router = useRouter();
  const user = useSession().data?.user;
  const sessionsQuery = api.sessions.getAll.useQuery();
  const sessions = sessionsQuery.data;
  const query = router.query;

  useEffect(() => {
    if (user?.role !== UserRole.ADMIN)
      router.replace("/403").catch((e) => toast.error((e as Error).message));
  }, [user, router]);

  if (!sessions || sessionsQuery.isLoading) {
    return <LoadingBar />;
  }

  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
      </Head>
      <NavigationBarContent>
        <NavButtons />
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>
      <main className="flex h-full flex-col items-center justify-start ">
        <div className="mt-4 flex gap-3">
          <span
            className="badge-secondary badge"
            onClick={() =>
              void router.replace({ pathname: "/all", query: { ...query } })
            }
          >
            By user
          </span>
          <span className="badge-accent badge">By session</span>
          <span
            className="badge-secondary badge"
            onClick={() =>
              void router.replace({
                pathname: "/all/flagged",
                query: { ...query },
              })
            }
          >
            Flagged
          </span>
        </div>
        <SessionList
          sessions={sessions}
          filterIn={searchtext}
          sortIn={sortIn}
        />
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Sessions;
