import { type NextPage } from "next";
import Head from "next/head";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { findAllTemplates } from "~/server/services/templateService";
import { type Template } from "@prisma/client";
import Link from "next/link";
import { useSessionSpeaker } from "~/sessions/SelectedSessionAndSpeaker";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr";
import { api } from "~/utils/api";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";




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



const Editor: NextPage<{ res: Template[], sess: string, speaker: string, anonymous: string }> = ({ res, sess, speaker, anonymous }) => {
  const title = api.sessions.getSessionById.useQuery({ id: sess }).data?.title
  useSessionSpeaker(sess, speaker, anonymous)
  // if (sess == undefined || speaker == undefined) {
  //   // throw ERROR!
  //   return <></>
  // }

  return (
    <>
      <NavigationBarContent>
        <h1>Templates</h1>
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-fit bg-base-200 p-1 text-center">
        <h1 data-cy="session" className="lg:inline">&emsp;&emsp;&emsp;&emsp;Session: {title}&emsp;&emsp;</h1><h1 data-cy="speaker" className="lg:inline"> Speaker: {speaker}</h1>
      </div>
      <main className="flex flex-col items-center justify-center h-full">

        <div className="flex flex-wrap gap-5 h-full justify-center p-5">
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

export default Editor;