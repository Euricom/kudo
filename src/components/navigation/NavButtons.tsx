import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { UserRole } from "~/types";
import { api } from "~/utils/api";

const NavButtons = () => {
  const router = useRouter();
  const path = router.pathname;
  const [state, setState] = useState<boolean>(false);
  const user = useSession().data?.user;

  const sessions = api.sessions.getSessionsBySpeaker.useQuery({
    id: user?.id ?? "error",
  }).data;

  return (
    <>
      <div
        className="dropdown-bottom dropdown mx-auto w-full"
        data-cy="NavButtons"
      >
        <label
          data-cy="NavButtonsLabel"
          onClick={() => setState(true)}
          tabIndex={0}
          className="flex w-full items-center text-2xl"
        >
          {path.includes("/all")
            ? "All Kudos"
            : path === "/out"
            ? "Sent Kudos"
            : path === "/"
            ? "My Kudos"
            : "eKudo"}
          &nbsp;
          <MdArrowDropDown size={25} />
        </label>
        {state && !(sessions?.length === 0 && user?.role !== UserRole.ADMIN) ? (
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box mx-auto w-full max-w-lg justify-center gap-1 bg-base-200 p-2 shadow"
          >
            {sessions?.length !== 0 ? (
              <li
                key="In"
                className={`border-b-2 ${path === "/" ? "text-accent" : ""}`}
              >
                <Link href="/" data-cy="In" onClick={() => setState(false)}>
                  My Kudos
                </Link>
              </li>
            ) : (
              ""
            )}
            <li key="Out" className={path === "/out" ? "text-accent" : ""}>
              <Link href="/out" data-cy="Out" onClick={() => setState(false)}>
                Sent Kudos
              </Link>
            </li>
            {user?.role === UserRole.ADMIN ? (
              <li
                key="All"
                className={`border-t-2 ${
                  path.includes("/all") ? "text-accent" : ""
                }`}
              >
                <Link href="/all" data-cy="All" onClick={() => setState(false)}>
                  All Kudos
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default NavButtons;
