import React from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { FiBell } from "react-icons/fi";
import { BsGearFill, BsArrowLeft } from "react-icons/bs";
import { useUtilButtons } from "~/hooks/useUtilButtons";

import { useTitle } from "./NavBarTitle";
import ThemeButton from "~/components/input/ThemeButton";
import { api } from "~/utils/api";
import Logo from "~/../public/images/KudoAppIcon.svg";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import NavButtons from "./NavButtons";

function useVisibleEndNavbarActions() {
  const router = useRouter();

  return [
    {
      Component: NotificationIcon,
      key: "notifButton",
      routes: ["/", "/out", "/all", "/all/sessions", "/all/flagged"],
    },
  ].filter((item) => item.routes.includes(router.pathname));
}

function useVisibleStartNavbarActions() {
  const router = useRouter();

  return [
    {
      Component: BackArrow,
      key: "backArrow",
      routes: [
        "/session/[...id]",
        "/session/presentation/[...id]",
        "/kudo/[...id]",
        "/speaker/[...id]",
        "/notifications",
        "/create",
        "/create/editor",
        "/create/templates",
        "/403",
      ],
    },
    {
      Component: logo,
      key: "logo",
      routes: ["/", "/out", "/all", "/all/sessions", "/all/flagged"],
    },
    {
      Component: () => <NavButtons />,
      key: "NavButtons",
      routes: ["/", "/out", "/all", "/all/sessions", "/all/flagged"],
    },
  ].filter((item) => item.routes.includes(router.pathname));
}

const NavBar = () => {
  const buttons = useUtilButtons(undefined);
  const visibleEndNavbarActions = useVisibleEndNavbarActions();
  const visibleStartNavbarActions = useVisibleStartNavbarActions();
  const title = useTitle();

  return (
    <>
      <div
        className="navbar sticky top-0 left-0 z-50 h-16 bg-base-100 shadow"
        data-cy="Navbar"
      >
        <div className="navbar-start h-full w-full gap-2 pl-2 sm:pl-8 ">
          {visibleStartNavbarActions.map((x) => (
            <x.Component key={x.key} />
          ))}
          <div
            className="z-10 w-fit overflow-hidden text-lg md:text-2xl"
            data-cy="NavbarTitle"
          >
            <>{title}</>
          </div>
        </div>

        <div className="navbar-end w-fit sm:pr-10">
          {buttons}
          {visibleEndNavbarActions.map((x) => (
            <x.Component key={x.key} />
          ))}
          <div className="hidden items-center lg:inline-flex">
            <div className="dropdown-end dropdown">
              <label
                tabIndex={0}
                className="btn-ghost btn-circle btn m-1"
                data-cy="SettingsButton"
              >
                <BsGearFill />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <label className="label cursor-pointer">
                    <span className="label-text">Notifications</span>
                    <input type="checkbox" className="toggle" />
                  </label>
                </li>
                <li>
                  <ThemeButton />
                </li>
              </ul>
            </div>
            <button className="btn-ghost btn" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

function NotificationIcon() {
  const user = useSession().data?.user;
  const amount =
    api.notifications.getAmountOfNotificationsById.useQuery({
      id: user?.id ?? "",
    }).data ?? 0;
  return (
    <>
      <Link
        className="btn-ghost btn-circle btn"
        data-cy="notificationButton"
        href="/notifications"
      >
        <div className="indicator">
          <FiBell size={20} />
          {amount > 0 && (
            <span className="badge-error badge badge-sm indicator-item border-collapse border border-neutral">
              {amount}
            </span>
          )}
        </div>
      </Link>
    </>
  );
}
function BackArrow() {
  const router = useRouter();
  return (
    <>
      <button
        className="btn-ghost btn-circle btn"
        onClick={() => router.back()}
        data-cy="BackArrow"
      >
        <BsArrowLeft size={20} />
      </button>
    </>
  );
}
function logo() {
  return (
    <>
      <label className="relative aspect-square h-full" data-cy="logo">
        <Image src={(Logo as StaticImageData).src} alt="Logo" fill />
      </label>
    </>
  );
}

export default NavBar;
