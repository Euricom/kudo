import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from 'next/router'
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { UserRole } from "~/types";

const NavButtons = () => {
  const router = useRouter()
  const path = router.asPath
  const [state, setState] = useState<boolean>(false)
  const user = useSession().data?.user
  
  return (
    <>
      <div className="dropdown dropdown-bottom mx-auto bg-base-100" data-cy='NavButtons'>
        <label data-cy='NavButtonsLabel' onClick={() => setState(true)} tabIndex={0} className="btn btn-ghost  m-1 text-3xl w-full">{path == '/all' ? "all" : path === "/out" ? "out" : path === "/" ? "in" : "eKudo"}&nbsp;<MdArrowDropDown size={25} /></label>
        {state ? <ul tabIndex={0} className="dropdown-content menu mx-auto justify-center p-2 gap-1 shadow rounded-box w-full bg-base-100">
          <li ><Link className="btn btn-outline" href="/" data-cy='In' onClick={() => setState(false)}>In</Link></li>
          <li><Link className="btn btn-outline " href="/out" data-cy='Out' onClick={() => setState(false)}>Out</Link></li>
          {user?.role===UserRole.ADMIN?<li><Link className="btn btn-outline" href="/all" data-cy='All' onClick={() => setState(false)}>All</Link></li>:""}
        </ul> : <></>}

      </div>
    </>
  );
};

export default NavButtons;