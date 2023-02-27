import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react"

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Auth>
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </Auth>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

interface iProps { 
  children?: React.ReactNode 
}

function Auth({ children }: iProps) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ 
    required: true,
    async onUnauthenticated() {
        await signIn("azure-ad")
    }, 
  })
  if (status === "loading") {
    return <div>Loading...</div>
  }

  return <>{children}</>
}


