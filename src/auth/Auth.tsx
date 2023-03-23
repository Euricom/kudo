import { signIn, useSession } from "next-auth/react";

interface AuthProps {
  children?: React.ReactNode
}

export function Auth({ children }: AuthProps) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({
    required: true,
    async onUnauthenticated() {
      await signIn("azure-ad", {}, { userId: "test" });
    },
  });
  if (status === "loading") {
    return (
      <>
        <div className="h-screen grid place-items-center">
          <progress className="progress progress-primary w-56"></progress>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
