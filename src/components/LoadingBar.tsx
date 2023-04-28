import Head from "next/head";
import Image from "next/image";
import Loading from "~/../public/images/Eurilogo.gif";

const LoadingBar = () => {
  return (
    <>
      <Head>
        <title>eKudo - Loading...</title>
        <meta name="description" content="Loading the page, please wait..." />
      </Head>
      <div className="grid w-full place-items-center">
        <div className="relative aspect-square h-1/6 w-1/6">
          <Image src={Loading} alt="Loading" />
        </div>
      </div>
    </>
  );
};

export default LoadingBar;
