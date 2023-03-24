import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useState } from "react";
import { type AuthProps } from "~/types";



export function Auth({ children }: AuthProps) {
  const update = api.users.updateUserIdAfterLogin.useMutation()
  const [updated, setUpdated] = useState<boolean>(false)

  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status, data } = useSession({
    required: true,
    async onUnauthenticated() {
      await signIn("azure-ad");
    },
  });
  if (!updated && data?.user.id && data?.user.email) {
    void update.mutateAsync({ id: data?.user.id, email: data?.user.email })
    setUpdated(true)
  }

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
