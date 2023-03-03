import { type NextPage/*, type GetServerSideProps */ } from "next";
import Head from "next/head";
import NavBar from "~/navigation/NavBar";
import NavButtons from "~/navigation/NavButtons";

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//     const post = await prisma.post.findUnique({
//       where: {
//         id: String(params?.id),
//       },
//       include: {
//         author: {
//           select: { name: true },
//         },
//       },
//     });
//     return {
//       props: params?.id,
//     };
// };

const Session: NextPage = () => {
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar
        titleContent={
          "Session: " + "Title"
        }
      >
        <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
          Session
        </main>
      </NavBar>
    </>
  );
};

export default Session;