import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Auth } from "../auth/Auth";
import NavBar from "~/navigation/NavBar";
import { UtilButtonsProvider } from "~/hooks/useUtilButtons";
import { TitleProvider } from "~/navigation/NavBarTitle";
import { SessionSpeakerProvider } from "~/sessions/SelectedSessionAndSpeaker";
import Footer from "~/navigation/Footer";

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
              <NavBar>
                <Component {...pageProps} />
                <Footer />
              </NavBar>
            </SessionSpeakerProvider>
          </UtilButtonsProvider>
        </TitleProvider>
      </Auth>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
