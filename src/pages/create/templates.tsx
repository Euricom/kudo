import { type NextPage } from "next";
import Head from "next/head";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { type Template } from "@prisma/client";
import Link from "next/link";
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
  query: { session: string; anonymous: string };
}) {
  return {
    props: {
      sess: context.query.session,
      anonymous: context.query.anonymous,
    },
  };
}

const Templates: NextPage<{
  sess: string;
  anonymous: string;
}> = ({ sess, anonymous }) => {
  const sessionQuery = api.sessions.getSessionById.useQuery({ id: sess });
  const session = sessionQuery.data;

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
      <main className="flex flex-col items-center justify-center p-5">
        <div className="flex flex-wrap justify-center gap-5 ">
          {templates?.map((x: Template) => (
            <Link
              className="card aspect-[3/2] h-52 w-80 overflow-hidden rounded-xl bg-white text-gray-800 shadow-xl"
              data-id={x.id}
              data-cy="template"
              href={{
                pathname: "/create/editor",
                query: {
                  template: x.id,
                  session: session?.id,
                  anonymous: anonymous,
                },
              }}
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
        urlWithParams={{
          pathname: "/create/editor",
          query: {
            template: templates[0]?.id.toString() ?? "",
            session: session?.id,
            anonymous: anonymous,
          },
          auth: null,
          hash: null,
          host: null,
          hostname: null,
          href: "/create/editor",
          path: null,
          protocol: null,
          search: null,
          slashes: null,
          port: null,
        }}
      />
    </>
  );
};

export default Templates;
