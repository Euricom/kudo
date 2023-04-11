import JSZip from "jszip";
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

export function getServerSideProps(context: { query: { id: string } }) {
  return {
    props: {
      id: context.query.id[0],
    },
  };
}

const Session: NextPage<{ id: string }> = ({ id }) => {
  const router = useRouter()
  const user = useSession().data?.user

  const sessionQuery = api.sessions.getSessionById.useQuery({ id: id });
  const session = sessionQuery.data;
  const kudosQuery = api.kudos.getKudosBySessionId.useQuery({
    id: session?.id ?? "",
  });
  const kudos = kudosQuery.data;
  const ids = kudos?.map((kudo) => kudo.image) ?? [];
  const imagesQuery = api.kudos.getImagesByIds.useQuery({ ids: ids });
  const images = imagesQuery.data;

  useEffect(() => {
    if(sessionQuery.isLoading) return
    if(user?.role !== UserRole.ADMIN && user?.id !== session?.speakerId) 
      router.replace("/403").catch(console.error)
  }, [user, router, session?.speakerId, sessionQuery.isLoading])

  if (sessionQuery.isLoading || kudosQuery.isLoading || imagesQuery.isLoading) {
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
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationBarContent>
        <h1>Session: {session?.title}</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        <button
          className="btn btn-ghost btn-circle "
          onClick={() => void downloadZip()}
          data-cy='DownloadButton'
        >
          <FiDownload size={20} />
        </button>
        <Link
          href={`/session/presentation/${id}`}
          className="btn btn-ghost btn-circle hidden lg:flex"
          data-cy='PresentationButton'
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
