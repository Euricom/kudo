import React from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { FiBell } from 'react-icons/fi';
import { IoLogoChrome } from 'react-icons/io';
import { BsGearFill, BsArrowLeft } from 'react-icons/bs'
import { useUtilButtons } from '~/hooks/useUtilButtons';

import { useTitle } from "./NavBarTitle";
import ThemeButton from '~/components/input/ThemeButton';
import { api } from '~/utils/api';
import Link from 'next/link';



function useVisibleEndNavbarActions() {
    const router = useRouter();

    return [
        {
            Component: NotificationIcon,
            key: 'notifButton',
            routes: ['/', '/out', '/all'],
        },
    ].filter((item) => item.routes.includes(router.pathname));
}

function useVisibleStartNavbarActions() {
    const router = useRouter();

    return [
        {
            Component: BackArrow,
            key: 'backArrow',
            routes: ['/session/[...id]', '/session/presentation/[...id]', '/kudo/[...id]', '/speaker/[...id]', '/notifications', '/create', '/create/editor', '/create/templates', '/403'],
        },
        {
            Component: logo,
            key: 'logo',
            routes: ['/', '/out', '/all'],
        }
    ].filter((item) => item.routes.includes(router.pathname));
}




const NavBar = () => {
    const buttons = useUtilButtons(undefined);
    const visibleEndNavbarActions = useVisibleEndNavbarActions();
    const visibleStartNavbarActions = useVisibleStartNavbarActions();
    const title = useTitle();

    return (
        <>
            <div className="navbar bg-base-100 shadow sticky z-50 top-0 left-0 " data-cy='Navbar'>
                <div className="navbar-start w-full sm:pl-8 pl-2">
                    {visibleStartNavbarActions.map((x) => (
                        <x.Component key={x.key} />
                    ))}
                    <div className="text-lg w-fit sm:text-2xl sm:navbar-center pl-2 z-10" data-cy='NavbarTitle'>
                        <>{title}</>
                    </div>
                </div>

                <div className="navbar-end w-fit sm:pr-10">
                    {buttons}
                    {visibleEndNavbarActions.map((x) => (
                        <x.Component key={x.key} />
                    ))}
                    <div className="hidden lg:inline-flex items-center">
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle m-1" data-cy='SettingsButton'><BsGearFill /></label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
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
                        <button className="btn btn-ghost" onClick={() => void signOut()}>
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

function NotificationIcon() {
    const user = useSession().data?.user
    const amount = api.notifications.getAmountOfNotificationsById.useQuery({ id: user?.id ?? "" }).data ?? 0
    return (
        <>
            <Link className="btn btn-ghost btn-circle" data-cy='notificationButton' href="/notifications">
                <div className="indicator">
                    <FiBell size={20} />
                    {amount > 0 && <span className="badge badge-sm badge-error border border-collapse border-neutral indicator-item">{amount}</span>}
                </div>
            </Link>
        </>
    );
}
function BackArrow() {
    const router = useRouter();
    return (
        <>
            <button className="btn btn-ghost btn-circle" onClick={() => router.back()} data-cy='BackArrow'>
                <BsArrowLeft size={20} />
            </button>
        </>
    );
}
function logo() {
    return (
        <>
            <label data-cy="logo">
                <IoLogoChrome size={25} />
            </label>
        </>)
}




export default NavBar;