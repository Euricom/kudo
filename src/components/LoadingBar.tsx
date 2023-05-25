import Head from "next/head";

const LoadingBar = () => {
  return (
    <>
      <Head>
        <title>eKudo - Loading...</title>
        <meta name="description" content="Loading the page, please wait..." />
      </Head>
      <div className="grid h-screen place-items-center">
        <progress className="progress progress-primary w-56"></progress>
      </div>
    </>
  );
};

export default LoadingBar;
