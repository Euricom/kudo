import Link from "next/link";
import { useRouter } from 'next/router'

const NavButtons = () => {
  const router = useRouter()

  return (
    <>
      <div className="btn-group">
        <Link className={"btn btn-secondary " + (router.pathname == "/" ? "btn-active" : "")} href="/">In</Link>
        <Link className={"btn btn-secondary " + (router.pathname == "/out" ? "btn-active" : "")} href="/out">Out</Link>
        <Link className={"btn btn-secondary " + (router.pathname == "/all" ? "btn-active" : "")} href="/all">All</Link>
      </div>
    </>
  );
};

export default NavButtons;