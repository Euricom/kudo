import React from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { FiBell, FiDownload } from 'react-icons/fi';
import { IoLogoChrome } from 'react-icons/io';
import { BsGearFill, BsArrowLeft } from 'react-icons/bs'
import { useUtilButtons } from '~/hooks/useUtilButtons';

import { useTitle } from "./NavBarTitle";
import ThemeButton from '~/input/ThemeButton';



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
            <div className="w-full navbar bg-base-100 shadow fixed z-50 ">
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
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle m-1" data-cy='SettingsButton'><BsGearFill /></label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <ThemeButton />
                                </li>
                                <li>
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Notifications</span>
                                        <input type="checkbox" className="toggle" />
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <button className="btn btn-ghost" onClick={() => void signOut()}>
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
            <div className="absolute w-full lg:w-1/2 my-2 md:my-4 p-5 pt-16 z-40 flex justify-center gap-2 mx-auto left-1/2 -translate-x-1/2">
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