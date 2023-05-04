import JSZip from "jszip";
import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import KudoCard from "~/components/kudos/Kudo";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { api } from "~/utils/api";
import FileSaver from "file-saver";
import LoadingBar from "~/components/LoadingBar";
import { FiDownload, FiMonitor } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { UserRole } from "~/types";
import { useEffect } from "react";
import { pusherClient } from "~/pusher/pusher.client";
import { type Kudo } from "@prisma/client";
import { getKudosBySessionId } from "~/server/services/kudoService";
import { toast } from "react-toastify";

export async function getServerSideProps(context: { query: { id: string } }) {
  const kudos = await getKudosBySessionId(context.query.id[0] ?? "");
  return {
    props: {
      id: context.query.id[0],
      initialKudos: kudos,
    },
  };
}

const Session: NextPage<{ id: string; initialKudos: Kudo[] }> = ({
  id,
  initialKudos,
}) => {
  const router = useRouter();
  const user = useSession().data?.user;
  const [kudos, setKudos] = useState<Kudo[]>(initialKudos);

  const sessionQuery = api.sessions.getSessionById.useQuery({ id: id });
  const session = sessionQuery.data;
  const ids = kudos?.map((kudo) => kudo.image) ?? [];
  const imagesQuery = api.kudos.getImagesByIds.useQuery({ ids: ids });
  const images = imagesQuery.data;

  useEffect(() => {
    const channel = pusherClient.subscribe(`session-${id}`);
    channel.bind("pusher:subscription_succeeded", function () {
      console.log("successfully subscribed!");
    });
    channel.bind("kudo-created", (data: { kudo: Kudo }) => {
      setKudos((k) => [...k, data.kudo]);
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
  }, [id]);

  useEffect(() => {
    if (sessionQuery.isLoading) return;
    if (user?.role !== UserRole.ADMIN && user?.id !== session?.speakerId)
      router.replace("/403").catch((e) => toast.error((e as Error).message));
  }, [user, router, session?.speakerId, sessionQuery.isLoading]);

  if (sessionQuery.isLoading || imagesQuery.isLoading) {
    return <LoadingBar />;
  }

  if (!session) {
    return <>404</>;
  }

  const downloadZip = async () => {
    const zip = new JSZip();
    const imageFolder = zip.folder(`Kudos`);

    const downloadPromises = kudos?.map(async (kudo, index) => {
      const fileName = `kudo_${index}.png`;
      const response = await fetch(
        images?.find((i) => i.id == kudo.image)?.dataUrl ?? ""
      );
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: "image/png" });
      imageFolder?.file(fileName, file);
    });

    if (downloadPromises?.length ?? 0 > 0) {
      await Promise.all(downloadPromises ?? []);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      FileSaver.saveAs(
        zipBlob,
        `Kudo's from ${session?.title} - ${session?.date}.zip`
      );
    }
  };

  return (
    <>
      <Head>
        <title>eKudo - Session</title>
        <meta
          name="description"
          content="Page where you can see all Kudo's from a Session."
        />
      </Head>
      <NavigationBarContent>Session: {session?.title}</NavigationBarContent>
      <UtilButtonsContent>
        <button
          className="btn-ghost btn-circle btn "
          onClick={() => void downloadZip()}
          data-cy="DownloadButton"
        >
          <FiDownload size={20} />
        </button>
        <Link
          href={`/session/presentation/${id}`}
          className="btn-ghost btn-circle btn hidden lg:flex"
          data-cy="PresentationButton"
        >
          <FiMonitor size={20} />
        </Link>
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

export default Session;
