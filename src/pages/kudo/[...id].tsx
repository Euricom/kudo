import { type Kudo } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { NavigationBarContent } from "~/navigation/NavBarTitle";
import { trpc } from "~/utils/trpc";
import { useEffect, useRef } from "react"


export function getServerSideProps(context: { query: { id: string }; }) {

  return {
    props: {
      id: context.query.id[0],
    }
  }
}




const KudoDetail: NextPage<{ id: string }> = ({ id }) => {


  const kudo: Kudo | null | undefined = trpc.kudos.getKudoById.useQuery({ id: id }).data
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    console.log(containerRef.current?.offsetWidth);
  }, [containerRef])
  const image: string | undefined = trpc.kudos.getImageById.useQuery({ id: kudo?.image ?? "error" }).data?.dataUrl

  if (!image || !kudo) {
    return <div>Something is not right.</div>
  }



  return (
    <>
      <NavigationBarContent>
        <h1>Kudo {kudo.sessionId}</h1>
      </NavigationBarContent>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <div className="flex justify-center ">
        <div className="card bg-white text-gray-800 aspect-[3/2] rounded-none w-[320px] h-[208px] mt-20">
          <Image className="shadow-2xl h-full w-full" src={image} fill alt="Kudo" />
        </div>
      </div> */}

      <div className="flex flex-col items-center justify-center h-full">
        <div className="aspect-[3/2] w-full max-h-full max-w-4xl bg-white" ref={containerRef}>
          <Image className="shadow-2xl" src={image} width={containerRef.current?.offsetWidth ?? 600} height={containerRef.current?.offsetHeight ?? 400} alt="Kudo" />
        </div>
      </div>
    </>
  );
};

export default KudoDetail;