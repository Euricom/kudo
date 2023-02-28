import { signIn, useSession } from "next-auth/react";

interface AuthProps  { 
  children?: React.ReactNode 
}

export function Auth({ children }: AuthProps) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({
    required: true,
    async onUnauthenticated() {
      await signIn("azure-ad");
    },
  });
  if (status === "loading" || true) {
    return <progress className="progress progress-primary w-56"></progress>;
  }

  // return <>{children}</>;
}
