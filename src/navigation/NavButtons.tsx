import Link from "next/link";
import { useRouter } from 'next/router'

const NavButtons = () => {
  const router = useRouter()
  const path = router.asPath
  console.log(path);
   

  return (
    <>
        <div className="dropdown dropdown-bottom mx-auto" data-cy='NavButtons'>
          <label tabIndex={0} className=" btn m-1 text-3xl">{path=='/all'?"all": path ==="/out"?"out": "in"}</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-black">
            <li><Link className="btn btn-ghost hover:btn-active " href="/" data-cy='In'>In</Link></li>
            <li><Link className="btn btn-ghost hover:btn-active" href="/out" data-cy='Out'>Out</Link></li>
            <li><Link className="btn btn-ghost hover:btn-active" href="/all" data-cy='All'>All</Link></li>
          </ul>
        </div>
    </>
  );
};

export default NavButtons;