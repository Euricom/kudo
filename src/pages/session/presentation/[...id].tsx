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
import { useTransition, animated } from "@react-spring/web";
import { QRCode } from "react-qrcode-logo";
import icon from "~/../public/favicon.ico";

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
  const { data: allKudos, isLoading: kudoLoading } =
    api.kudos.getKudosBySessionId.useQuery({
      id: session?.id ?? "",
    });

  const DURATION_SECONDEN = 4;

  const transitions = useTransition(kudos, {
    from: { x: 0, y: 0, opacity: 0, scale: 3, rotate: 0 },
    enter: (kudo, index) => async (next) => (
      await next({
        opacity: 1,
        delay: index * (DURATION_SECONDEN * 1000 + 1000),
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

  useEffect(() => {
    const newKudos =
      allKudos?.map((kudo) => {
        const { rX, rY, rot } = getRandomPosition();
        return {
          id: kudo.id,
          x: rX,
          y: rY,
          rot: rot,
          kudo: kudo,
        };
      }) ?? [];
    setKudos((k) => [
      ...k,
      ...newKudos.filter((kudo) => !k.find((item) => item.id === kudo.id)),
    ]);
  }, [allKudos]);

  if (sessionQuery.isLoading || kudoLoading) {
    return <LoadingBar />;
  }

  if (!session) {
    return <>404</>;
  }

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
