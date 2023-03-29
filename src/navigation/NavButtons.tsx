import Link from "next/link";
import { useRouter } from 'next/router'
import { useState } from "react";
import { MdArrowDropDown } from "react-icons/md";

const NavButtons = () => {
  const router = useRouter()
  const path = router.asPath
  const [state, setState] = useState<boolean>(false)



  return (
    <>
      <div className="dropdown dropdown-bottom mx-auto bg-white" data-cy='NavButtons'>
        <label onClick={() => setState(true)} tabIndex={0} className="btn btn-ghost  m-1 text-3xl w-full">{path == '/all' ? "all" : path === "/out" ? "out" : "in"}&nbsp;<MdArrowDropDown size={25} /></label>
        {state ? <ul tabIndex={0} className="dropdown-content menu mx-auto justify-center p-2 gap-1 shadow rounded-box w-full  text-black">
          <li ><Link className="btn bg-secondary-content hover:btn-active hover:text-white px-11" href="/" data-cy='In' onClick={() => setState(false)}>In</Link></li>
          <li><Link className="btn bg-secondary-content hover:btn-active hover:text-white" href="/out" data-cy='Out' onClick={() => setState(false)}>Out</Link></li>
          <li><Link className="btn bg-secondary-content hover:btn-active hover:text-white" href="/all" data-cy='All' onClick={() => setState(false)}>All</Link></li>
        </ul> : <></>}

      </div>
    </>
  );
};

export default NavButtons;