import { type NextPage } from "next";
import Head from "next/head";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { type Template } from "@prisma/client";
import Link from "next/link";
import { useSessionSpeaker } from "~/components/sessions/SelectedSessionAndSpeaker";
import FAB from "~/components/navigation/FAB";
import { useEffect } from "react";
import { GrNext } from "react-icons/gr";
import { api } from "~/utils/api";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import { useRouter } from "next/router";
import LoadingBar from "~/components/LoadingBar";
import { toast } from "react-toastify";
import Image from "next/image";

export function getServerSideProps(context: {
  query: { session: string; speaker: string; anonymous: string };
}) {
  return {
    props: {
      sess: context.query.session,
      speakerid: context.query.speaker,
      anonymous: context.query.anonymous,
    },
  };
}

const Templates: NextPage<{
  sess: string;
  speakerid: string;
  anonymous: string;
}> = ({ sess, speakerid, anonymous }) => {
  const sessionQuery = api.sessions.getSessionById.useQuery({ id: sess });
  const session = sessionQuery.data;

  const userQuery = api.users.getUserById.useQuery({ id: speakerid });
  const speaker = userQuery.data;
  const router = useRouter();

  const templateQuery = api.templates.getAllTemplates.useQuery();
  const templates = templateQuery.data;

  const imageQuery = api.kudos.getImagesByIds.useQuery({
    ids: templates?.map((r) => r.image) ?? [],
  });
  const images = imageQuery.data;

  useEffect(() => {
    toast.clearWaitingQueue();
    if (!sessionQuery.isLoading && !session) {
      toast.error("Session is incorrect", { delay: 500 });
      router.replace("/create").catch((e: Error) => toast.error(e.message));
    }
  }, [router, session, sessionQuery]);

  useSessionSpeaker(sess, speakerid, anonymous);

  if (
    sessionQuery.isLoading ||
    !session ||
    templateQuery.isLoading ||
    imageQuery.isLoading ||
    !templates
  ) {
    return <LoadingBar />;
  }

  return (
    <>
      <Head>
        <title>eKudo - Templates</title>
        <meta
          name="description"
          content="Page with all editor templates you can choose from."
        />
      </Head>
      <NavigationBarContent>
        <h1>New Kudo: {session.title}</h1>
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>
      <main className="flex flex-col items-center justify-center">
        <div className="mb-8 flex flex-wrap justify-center gap-5 px-5 md:mb-28">
          {templates?.map((x: Template) => (
            <Link
              className="card aspect-[3/2] h-52 w-80 overflow-hidden rounded-xl bg-white text-gray-800 shadow-xl"
              data-id={x.id}
              data-cy="template"
              href={{ pathname: "/create/editor", query: { template: x.id } }}
              key={x.id}
            >
              <Image
                className="absolute h-full"
                src={images?.find((i) => i.id === x.image)?.dataUrl ?? ""}
                width={320}
                height={208}
                alt={`Template ${x.name}`}
              />
            </Link>
          ))}
        </div>
      </main>
      <FAB
        text={"Next"}
        icon={<GrNext />}
        url={"/create/editor?template=" + (templates[0]?.id.toString() ?? "")}
      />
    </>
  );
};

export default Templates;
