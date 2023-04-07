import { type NextPage } from "next";
import FAB from "~/components/navigation/FAB";
import { GrAdd } from 'react-icons/gr';
import { NavigationBarContent } from "~/components/navigation/NavBarTitle";
import { UtilButtonsContent } from "~/hooks/useUtilButtons";
import Link from "next/link";


const Unauthorised: NextPage = () => {

  return (
    <>
      <NavigationBarContent>
        Unauthorised
      </NavigationBarContent>
      <UtilButtonsContent>
        <></>
      </UtilButtonsContent >
      <main className="flex flex-col gap-4 items-center justify-center h-full">
        <div className="text-3xl">403 | Unauthorised</div>
        <Link href={"/"} className="btn btn-accent">Go home</Link>
      </main>
      <FAB text={"Create Kudo"} icon={<GrAdd />} url="/create" />
    </>
  );
};

export default Unauthorised;