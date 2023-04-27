import { type NextPage } from "next";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from "react-icons/gr";
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import Link from "next/link";
import Head from "next/head";

const Unauthorised: NextPage = () => {
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
      </Head>
      <NavigationBarContent>Unauthorised</NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent>
      <main className="flex h-full flex-col items-center justify-center gap-4">
        <div className="text-3xl">403 | Unauthorised</div>
        <Link href={"/"} className="btn-accent btn">
          Go home
        </Link>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Unauthorised;
