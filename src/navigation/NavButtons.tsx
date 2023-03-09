import Link from "next/link";
import { useRouter } from 'next/router'

const NavButtons = () => {
  const router = useRouter()

  return (
    <>
      <div className="btn-group" data-cy='NavButtons'>
        <Link className={"btn btn-secondary " + (router.pathname == "/" ? "btn-active" : "")} href="/" data-cy='In'>In</Link>
        <Link className={"btn btn-secondary " + (router.pathname == "/out" ? "btn-active" : "")} href="/out" data-cy='Out'>Out</Link>
        <Link className={"btn btn-secondary " + (router.pathname == "/all" ? "btn-active" : "")} href="/all" data-cy='All'>All</Link>
      </div>
    </>
  );
};

export default NavButtons;