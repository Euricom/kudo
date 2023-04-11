import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import KudoCard from "~/components/kudos/Kudo";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";
import { FiMonitor } from "react-icons/fi";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { type PresentationKudo } from "~/types";
import { useTransition, animated } from '@react-spring/web';
import Image from "next/image";
import QR_Placeholder from "~/contents/images/QR_code_Placeholder.png";

export function getServerSideProps(context: { query: { id: string } }) {
  return {
    props: {
      id: context.query.id[0],
    },
  };
}

const Presentation: NextPage<{ id: string }> = ({ id }) => {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [kudos, setKudos] = useState<PresentationKudo[]>([]);

  const sessionQuery = api.sessions.getSessionById.useQuery({ id: id });
  const session = sessionQuery.data;
  const { data: allKudos, isLoading: kudoLoading } = api.kudos.getKudosBySessionId.useQuery({
    id: session?.id ?? "",
  });

  const DURATION_SECONDEN = 4;

  const transitions = useTransition(kudos, {
    from: {x: 0, y: 0,  opacity: 0, scale: 3, rotate: 0},
    enter: (kudo, index) => async (next) => (
      await next({ opacity: 1, delay: index * (DURATION_SECONDEN * 1000 + 1000)}),
      await next({x: kudo.x, y: kudo.y, scale: 1, rotate: kudo.rot, delay: DURATION_SECONDEN *0.6 *1000,
        config: {
          duration: DURATION_SECONDEN *0.4 *1000,
        }})
    ),
  })



  useEffect(() => {
    const newKudos = allKudos?.map((kudo) => {
      const {rX, rY, rot} = getRandomPosition();
      return {
        id: kudo.id, 
        x: rX,
        y: rY,
        rot: rot,
        kudo: kudo,
      }
    }) ?? [];
    setKudos(k => [...k, ...newKudos.filter((kudo) => !k.find((item) => item.id === kudo.id))]);
  }, [allKudos]);


  if (sessionQuery.isLoading || kudoLoading) {
    return <LoadingBar />;
  }

  if (!session) {
    return <>404</>;
  }

  function getRandomPosition() {
    const width = dropzoneRef.current?.offsetWidth??1;
    const height = dropzoneRef.current?.offsetHeight??1;
    const x = width*0.7;
    const y = height*0.8;
    const rX = Math.floor(Math.random() * x) - (x/2);
    const rY = Math.floor(Math.random() * y) - (y/2);

    const rot = Math.floor(Math.random() * (90)) - 45

    return {rX, rY, rot};
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
        className="flex flex-col items-center justify-center h-full"
        data-cy="Session"
      >
        <div ref={dropzoneRef} className="relative flex justify-center items-center h-full w-full overflow-hidden">
          <div className="relative w-64 h-64">
            <Image
              src={QR_Placeholder}
              alt="QR Code"
              fill
            />
          </div>
          {kudos == undefined || kudos.length == 0 ? (
              <></>
            ) : (
              transitions((style, kudo) => ( kudo &&
                  <animated.div 
                    key={kudo.id} 
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{...style}}
                  >
                    <KudoCard kudo={kudo.kudo} isPresentation={true}/>
                  </animated.div>
              ))
          )}
        </div>
      </main>
    </>
  );
};

export default Presentation;
