import { type NextPage } from "next";
import Head from "next/head";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { findAllTemplates } from "~/server/services/templateService";
import { type Template } from "@prisma/client";
import Link from "next/link";
import { useSessionSpeaker } from "~/components/sessions/SelectedSessionAndSpeaker";
import FAB from "~/components/navigation/FAB";
import { useEffect } from 'react'
import { GrNext } from "react-icons/gr";
import { api } from "~/utils/api";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { useRouter } from "next/router";
import LoadingBar from "~/components/LoadingBar";
import { toast } from "react-toastify";




export async function getServerSideProps(context: { query: { session: string, speaker: string, anonymous: string }; }) {

  const data: Template[] = await findAllTemplates()
  return {
    props: {
      res: data,
      sess: context.query.session,
      speaker: context.query.speaker,
      anonymous: context.query.anonymous
    }
  }
}

const Templates: NextPage<{ res: Template[], sess: string, speaker: string, anonymous: string }> = ({ res, sess, speaker, anonymous }) => {
  const sessionQuery = api.sessions.getSessionById.useQuery({ id: sess })
  const session = sessionQuery.data
  const router = useRouter()

  useEffect(() => {
    toast.clearWaitingQueue();
    if (!sessionQuery.isLoading && !session) {
      toast.error('Session is incorrect', { delay: 500 })
      router.replace('/create').catch(console.error);
    }
  }, [router, session, sessionQuery])


  useSessionSpeaker(sess, speaker, anonymous)

  if (sessionQuery.isLoading || !session) {
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
        <h1>Templates</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>

      <div className="w-full h-fit bg-base-200 p-1 text-center sticky top-16 z-50">
        <h1 data-cy="session" className="lg:inline">&emsp;&emsp;&emsp;&emsp;Session: {session?.title}&emsp;&emsp;</h1><h1 data-cy="speaker" className="lg:inline"> Speaker: {speaker}</h1>
      </div>
      <main className="flex flex-col items-center justify-center">

        <div className="flex flex-wrap gap-5 justify-center px-5 mb-8 md:mb-28">
          {res.map((x: Template) => (
            <Link className="card bg-white text-gray-800 shadow-xl aspect-[3/2] rounded-none w-80 h-52" data-cy="template" href={{ pathname: "/create/editor", query: { template: x.id } }} key={x.id}>
              <div className="card-body p-0">
                <h2 className='card-title text-white justify-center p-4' style={{ backgroundColor: x.Color }} data-cy="templateTitle">{x.Title}</h2>
                <div className="flex p-8">
                  <figure>
                    {x.Sticker}
                  </figure>
                  <p></p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <FAB text={"Next"} icon={<GrNext />} url={'/create/editor?template=' + (res[0]?.id.toString() ?? '')} />
    </>
  );
};

export default Templates;