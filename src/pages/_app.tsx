import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Auth } from "../components/auth/Auth";
import NavBar from "~/components/navigation/NavBar";
import { UtilButtonsProvider } from "~/hooks/useUtilButtons";
import { TitleProvider } from "~/components/navigation/NavBarTitle";
import Footer from "~/components/navigation/Footer";
import Menu from "~/components/navigation/Menu";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import Logo from "~/../public/images/KudoAppIcon.svg";
import { type StaticImageData } from "next/image";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>eKudo - Geef je collega&apos;s feedback</title>
        <meta name="description" content="eKudo app" />
        <link rel="shortcut icon" href={(Logo as StaticImageData).src} />
      </Head>
      <SessionProvider session={session}>
        <Auth>
          <TitleProvider>
            <UtilButtonsProvider>
              <div className="h-screen w-full bg-base-200 dark:bg-base-300">
                <Menu>
                  <NavBar />
                  <div className="flex-auto flex-shrink-0">
                    <Component {...pageProps} />
                    <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      limit={5}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      className=" mt-14"
                    />
                  </div>
                  <Footer />
                </Menu>
              </div>
            </UtilButtonsProvider>
          </TitleProvider>
        </Auth>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
