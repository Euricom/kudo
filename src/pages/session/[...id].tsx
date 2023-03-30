import { type NextPage } from "next";
import Head from "next/head";
import KudoCard from "~/kudos/Kudo";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { api } from "~/utils/api";
import { AiOutlineHeart } from 'react-icons/ai'

export function getServerSideProps(context: { query: { id: string }; }) {
  return {
    props: {
      id: context.query.id[0],
    }
  }
}


const Session: NextPage<{ id: string }> = ({ id }) => {

  const session = api.sessions.getSessionById.useQuery({ id: id }).data
  if (!session) {
    const kudos = api.kudos.getKudosBySessionId.useQuery({ id: "error" }).data
    kudos?.length
    return <></>
  }
  const kudos = api.kudos.getKudosBySessionId.useQuery({ id: session.id }).data
  return (
    <>

      <NavigationBarContent>
        <h1>Session: {session?.title}</h1>
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center h-full " data-cy="Session">
        <div className="btn btn-square btn-ghost" data-cy="Like">
          <AiOutlineHeart size={25} />
        </div>
        <div className="flex flex-wrap gap-5 h-full justify-center p-5">
          {kudos == undefined || kudos.length == 0 ? <h1>No Kudos received Yet</h1> :
            kudos.map((kudo) => (
              <KudoCard key={kudo.id} kudo={kudo} />
            ))}

        </div>
      </main>
    </>
  );
};

export default Session;