import Head from "next/head";
import Image from "next/image";

const LoadingBar = () => {
  return (
    <>
      <Head>
        <title>eKudo - Loading...</title>
        <meta name="description" content="Loading the page, please wait..." />
      </Head>
      <div className="grid w-full place-items-center">
        <div className="relative aspect-square h-1/6 w-1/6">
          <Image src="/images/Eurilogo.gif" alt="Loading" />
        </div>
      </div>
    </>
  );
};

export default LoadingBar;
