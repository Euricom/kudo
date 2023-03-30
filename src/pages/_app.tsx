import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Auth } from "../components/auth/Auth";
import NavBar from "~/components/navigation/NavBar";
import { UtilButtonsProvider } from "~/hooks/useUtilButtons";
import { TitleProvider } from "~/components/navigation/NavBarTitle";
import { SessionSpeakerProvider } from "~/components/sessions/SelectedSessionAndSpeaker";
import Footer from "~/components/navigation/Footer";
import Menu from "~/components/navigation/Menu";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Auth>
        <TitleProvider>
          <UtilButtonsProvider>
            <SessionSpeakerProvider>
              <div className="h-full w-full bg-base-200 dark:bg-base-300">
                <Menu>
                  <NavBar />
                  <div className="mt-14 pb-32 h-full">
                    <Component {...pageProps} />
                  </div>
                  <Footer />
                </Menu>
              </div>
            </SessionSpeakerProvider>
          </UtilButtonsProvider>
        </TitleProvider>
      </Auth>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
