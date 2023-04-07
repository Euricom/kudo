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

  const DURATION_SECONDEN = 3;

  const transitions = useTransition(kudos, {
    from: { x: (dropzoneRef.current?.offsetWidth??1)/2, y: (dropzoneRef.current?.offsetHeight??1)/2,  opacity: 0, scale: 3, rotate: 0},
    enter: (kudo, index) => async (next) => (
      await next({ opacity: 1, delay: index * (DURATION_SECONDEN+1) * 1000}),
      await next({ x: kudo.x, y: kudo.y, scale: 1, rotate: kudo.rot,
        config: {
          duration: DURATION_SECONDEN * 1000,
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
    const x = (dropzoneRef.current?.offsetWidth??1)*0.7;
    const y = (dropzoneRef.current?.offsetHeight??1)*0.8;
    const rX = Math.floor(Math.random() * x);
    const rY = Math.floor(Math.random() * y);

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
        <div ref={dropzoneRef} className="relative h-full w-full overflow-hidden">
          {kudos == undefined || kudos.length == 0 ? (
              <></>
            ) : (
              transitions((style, kudo) => ( kudo &&
                  <animated.div 
                    key={kudo.id} 
                    className="absolute"
                    style={{translateX: '-50%', translateY: '-50%', ...style}}
                  >
                    <KudoCard kudo={kudo.kudo} hideLiked={true}/>
                  </animated.div>
              ))
          )}
        </div>
      </main>
    </>
  );
};

export default Presentation;
