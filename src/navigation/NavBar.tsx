import React from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { FiBell, FiDownload } from 'react-icons/fi';
import { IoLogoChrome } from 'react-icons/io';
import { BsGearFill, BsArrowLeft } from 'react-icons/bs'
import { useUtilButtons } from '~/hooks/useUtilButtons';

import { useTitle } from "./NavBarTitle";



function useVisibleEndNavbarActions() {
    const router = useRouter();

    return [
        {
            Component: NotificationIcon,
            key: 'notifButton',
            routes: ['/', '/out', '/all'],
        },
        {
            Component: DownloadIcon,
            key: 'downloadButton',
            routes: ['/session/[...id]'],
        },
    ].filter((item) => item.routes.includes(router.pathname));
}

function useVisibleStartNavbarActions() {
    const router = useRouter();

    return [
        {
            Component: BackArrow,
            key: 'backArrow',
            routes: ['/session/[...id]', '/kudo/[...id]', '/notifications', '/create', '/create/editor', '/create/templates'],
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
            <div className="w-full navbar bg-base-100 fixed z-50 ">
                <div className="navbar-start w-full">
                    <label data-cy="logo">
                        <IoLogoChrome size={25} />
                    </label>
                    {visibleStartNavbarActions.map((x) => (
                        <x.Component key={x.key} />
                    ))}
                    <div className="text-lg w-full sm:text-2xl sm:navbar-center z-10" data-cy='NavbarTitle'>
                        <>{title}</>
                    </div>
                </div>

                <div className="navbar-end w-fit sm:pr-10">
                    {visibleEndNavbarActions.map((x) => (
                        <x.Component key={x.key} />
                    ))}
                    <div className="hidden lg:inline-flex">
                        <button className="btn btn-ghost btn-circle" data-cy='SettingsButton'>
                            <BsGearFill />
                        </button>
                        <button className="btn btn-ghost" onClick={() => void signOut()}>
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute md:right-1/4 my-2 pt-16 z-40 flex self-center gap-2">
                {buttons}
            </div>
        </>
    );
};

function NotificationIcon() {
    return (
        <>
            <button className="btn btn-ghost btn-circle" data-cy='notificationButton'>
                <div className="indicator">
                    <FiBell size={20} />
                    <span className="badge badge-sm badge-error border border-collapse border-neutral indicator-item">12</span>
                </div>
            </button>
        </>
    );
}

function DownloadIcon() {
    return (
        <>
            <button className="btn btn-ghost btn-circle" data-cy='DownloadButton'>
                <FiDownload size={20} />
            </button>
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



export default NavBar;