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
        className="dropdown-bottom dropdown mx-auto bg-base-100"
        data-cy="NavButtons"
      >
        <label
          data-cy="NavButtonsLabel"
          onClick={() => setState(true)}
          tabIndex={0}
          className="btn-ghost btn  m-1 w-full text-3xl"
        >
          {path.includes("/all")
            ? "all"
            : path === "/out"
            ? "out"
            : path === "/"
            ? "in"
            : "eKudo"}
          &nbsp;
          <MdArrowDropDown size={25} />
        </label>
        {state && !(sessions?.length === 0 && user?.role !== UserRole.ADMIN) ? (
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box mx-auto w-full justify-center gap-1 bg-base-100 p-2 shadow"
          >
            {sessions?.length !== 0 ? (
              <li>
                <Link
                  className="btn-outline btn"
                  href="/"
                  data-cy="In"
                  onClick={() => setState(false)}
                >
                  In
                </Link>
              </li>
            ) : (
              ""
            )}
            <li>
              <Link
                className="btn-outline btn "
                href="/out"
                data-cy="Out"
                onClick={() => setState(false)}
              >
                Out
              </Link>
            </li>
            {user?.role === UserRole.ADMIN ? (
              <li>
                <Link
                  className="btn-outline btn"
                  href="/all"
                  data-cy="All"
                  onClick={() => setState(false)}
                >
                  All
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
