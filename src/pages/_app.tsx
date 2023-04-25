import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { PusherProvider } from '~/utils/pusher'

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Auth } from "../components/auth/Auth";
import NavBar from "~/components/navigation/NavBar";
import { UtilButtonsProvider } from "~/hooks/useUtilButtons";
import { TitleProvider } from "~/components/navigation/NavBarTitle";
import Footer from "~/components/navigation/Footer";
import Menu from "~/components/navigation/Menu";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Auth>
        <PusherProvider>
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
                      className=" mt-14" />
                  </div>
                  <Footer />
                </Menu>
              </div>
            </UtilButtonsProvider>
          </TitleProvider>
        </PusherProvider>
      </Auth>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
