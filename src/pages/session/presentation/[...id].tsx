import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import KudoCard from "~/components/kudos/Kudo";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";
import { FiMonitor } from "react-icons/fi";
import { useRouter } from "next/router";

export function getServerSideProps(context: { query: { id: string } }) {
  return {
    props: {
      id: context.query.id[0],
    },
  };
}

const Presentation: NextPage<{ id: string }> = ({ id }) => {
  const sessionQuery = api.sessions.getSessionById.useQuery({ id: id });
  const session = sessionQuery.data;
  const kudosQuery = api.kudos.getKudosBySessionId.useQuery({
    id: session?.id ?? "",
  });
  const kudos = kudosQuery.data;

  const router = useRouter();

  if (sessionQuery.isLoading || kudosQuery.isLoading) {
    return <LoadingBar />;
  }

  if (!session) {
    return <>404</>;
  }

  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationBarContent>
        <h1>Session: {session?.title}</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        <button
          onClick={() => router.back()}
          className="btn btn-circle btn-primary hidden lg:flex"
          data-cy='PresentationButton'
        >
          <FiMonitor size={20} />
        </button>
      </UtilButtonsContent>
      <main
        className="flex flex-col items-center justify-center"
        data-cy="Session"
      >
        <div className="flex h-full flex-wrap justify-center gap-5 p-5">
          {kudos == undefined || kudos.length == 0 ? (
            <h1>No Kudos received Yet</h1>
          ) : (
            kudos.map((kudo) => <KudoCard key={kudo.id} kudo={kudo} />)
          )}
        </div>
      </main>
    </>
  );
};

export default Presentation;
