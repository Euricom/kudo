import { type NextPage } from "next";
import Head from "next/head";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr"
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { findAllTemplates } from "~/server/services/templateService";
import { type Template } from "@prisma/client";
import Link from "next/link";




export async function getServerSideProps() {
  const data: Template[] = await findAllTemplates()
  return {
    props: {
      res: data,
    }
  }
}

type template = {
  id: string,
  Color: string,
  Title: string,
  Sticker: string,
}



const Editor: NextPage<{ res: Template[] }> = ({ res }) => {
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
      <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
        <div className="flex flex-wrap gap-5 h-full justify-center p-5">
          {res.map((x: template) => (
            <Link className="card bg-white text-gray-800 shadow-xl aspect-[3/2] rounded-none w-80 h-52" data-cy="Kudo" href={{ pathname: "/create/editor", query: { template: x.id } }} key={x.id}>
              <div className="card-body p-0">
                <h2 className='card-title justify-center p-4' style={{ backgroundColor: x.Color }}>{x.Title}</h2>
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
      <FAB text={"Next"} icon={<GrNext />} url="/create/editor" />
    </>
  );
};

export default Editor;