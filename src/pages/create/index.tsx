import { type NextPage } from "next";
import Head from "next/head";
import NavBar from "~/navigation/NavBar";
import NavButtons from "~/navigation/NavButtons";
import FAB from "~/navigation/FAB";
import { GrNext } from "react-icons/gr"
import Select from "~/input/Select";

const New: NextPage = () => {
  const speakers = ["Steve Jobs", "Bill Gates", "Steven Universe"];
  const sessions = ["Ted talk 1", "Gaming", "???"];
  return (
    <>
      <Head>
        <title>eKudo</title>
        <meta name="description" content="eKudo app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar
        titleContent={
          <NavButtons />
        }
      >
        <main className="flex flex-col items-center justify-center overflow-y-scroll h-full">
          <div className="form-control">
            <Select label="Speaker" options={speakers}/>
            <Select label="Session" options={sessions}/>
            <label className="label cursor-pointer">
              <input type="checkbox" className="checkbox" />
              <span className="label-text">Hide my name.</span> 
            </label>
          </div>
        </main>
        <FAB text={"Next"} icon={<GrNext />}/>
      </NavBar>
    </>
  );
};

export default New;