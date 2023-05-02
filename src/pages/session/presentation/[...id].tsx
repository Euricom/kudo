import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import KudoCard from "~/components/kudos/Kudo";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { api } from "~/utils/api";
import LoadingBar from "~/components/LoadingBar";
import { FiMonitor } from "react-icons/fi";
import { useRouter } from "next/router";
import { useRef, useState, useEffect, useCallback } from "react";
import { type PresentationKudo } from "~/types";
import { useTransition, animated } from "@react-spring/web";
import { QRCode } from "react-qrcode-logo";
import icon from "~/../public/favicon.ico";
import { pusherClient } from "~/pusher/pusher.client";
import { type Kudo } from "@prisma/client";
import { getKudosBySessionId } from "~/server/services/kudoService";

export async function getServerSideProps(context: { query: { id: string } }) {
  const kudos = await getKudosBySessionId(context.query.id[0] ?? "");
  return {
    props: {
      id: context.query.id[0],
      initialKudos: kudos,
    },
  };
}

const Presentation: NextPage<{ id: string; initialKudos: Kudo[] }> = ({
  id,
  initialKudos,
}) => {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const makePresentationKudo = useCallback((kudo: Kudo) => {
    const { rX, rY, rot } = getRandomPosition();
    const newKudo = {
      id: kudo.id,
      x: rX,
      y: rY,
      rot: rot,
      kudo: kudo,
    };
    return newKudo;
  }, []);

  const [kudos, setKudos] = useState<PresentationKudo[]>([]);

  const sessionQuery = api.sessions.getSessionById.useQuery({ id: id });
  const session = sessionQuery.data;

  const DURATION_SECONDEN = 4;

  const transitions = useTransition(kudos, {
    from: { x: 0, y: 0, opacity: 0, scale: 3, rotate: 0 },
    enter: (kudo) => async (next) => (
      await next({
        opacity: 1,
        delay: DURATION_SECONDEN * 1000 + 1000,
      }),
      await next({
        x: kudo.x,
        y: kudo.y,
        scale: 1,
        rotate: kudo.rot,
        delay: DURATION_SECONDEN * 0.6 * 1000,
        config: {
          duration: DURATION_SECONDEN * 0.4 * 1000,
        },
      })
    ),
  });

  function getRandomPosition() {
    const width = dropzoneRef.current?.offsetWidth ?? 1;
    const height = dropzoneRef.current?.offsetHeight ?? 1;
    const x = width * 0.7;
    const y = height * 0.8;
    const rX = Math.floor(Math.random() * x) - x / 2;
    const rY = Math.floor(Math.random() * y) - y / 2;

    const rot = Math.floor(Math.random() * 90) - 45;

    return { rX, rY, rot };
  }

  useEffect(() => {
    const channel = pusherClient.subscribe(`session-${id}`);
    channel.bind("pusher:subscription_succeeded", function () {
      console.log("successfully subscribed!");
    });
    channel.bind("kudo-created", (data: { kudo: Kudo }) => {
      setKudos((k) => [...k, makePresentationKudo(data.kudo)]);
    });
    channel.bind("kudo-deleted", (data: { kudo: Kudo }) => {
      setKudos((k) => [...k.filter((kudo) => kudo.id !== data.kudo.id)]);
    });
    return () => {
      channel.unbind("pusher:subscription_succeeded");
      channel.unbind("kudo-created");
      channel.unbind("kudo-deleted");
      channel.unsubscribe();
    };
  }, [id, makePresentationKudo]);

  useEffect(() => {
    setKudos(initialKudos.map((k) => makePresentationKudo(k)));
  }, [initialKudos, makePresentationKudo]);

  if (sessionQuery.isLoading) {
    return <LoadingBar />;
  }

  if (!session) {
    return <>404</>;
  }

  return (
    <>
      <Head>
        <title>eKudo - Presentation</title>
        <meta
          name="description"
          content="Page where you can present all Kudo's from a Session."
        />
      </Head>
      <NavigationBarContent>
        <h1>Session: {session?.title}</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        <button
          onClick={() => router.back()}
          className="btn-primary btn-circle btn hidden lg:flex"
          data-cy="PresentationButton"
        >
          <FiMonitor size={20} />
        </button>
      </UtilButtonsContent>
      <main
        className="flex h-full flex-col items-center justify-center"
        data-cy="Session"
      >
        <div
          ref={dropzoneRef}
          className="relative flex h-full w-full items-center justify-center overflow-hidden"
        >
          <QRCode
            value={window.location.hostname + "/create?session=" + session?.id}
            logoImage={icon.src}
            size={256}
            removeQrCodeBehindLogo={true}
          />
          {kudos == undefined || kudos.length == 0 ? (
            <></>
          ) : (
            transitions(
              (style, kudo) =>
                kudo && (
                  <animated.div
                    key={kudo.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ ...style }}
                  >
                    <KudoCard kudo={kudo.kudo} isPresentation={true} />
                  </animated.div>
                )
            )
          )}
          <div className="absolute bottom-0 left-0 z-50">
            <QRCode
              value={
                window.location.hostname + "/create?session=" + session?.id
              }
              logoImage={icon.src}
              size={128}
              removeQrCodeBehindLogo={true}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Presentation;
