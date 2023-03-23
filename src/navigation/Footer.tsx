import React from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { FiBell, FiMenu, FiDownload } from 'react-icons/fi';
import { BsGearFill, BsArrowLeft } from 'react-icons/bs'
import Image from 'next/image';
import avatar from '../contents/images/EMAvatar.jpg'
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


interface NavBarProps {
    children?: React.ReactNode
}

const Footer = ({ children }: NavBarProps) => {
    const buttons = useUtilButtons(undefined);
    const visibleEndNavbarActions = useVisibleEndNavbarActions();
    const visibleStartNavbarActions = useVisibleStartNavbarActions();
    const title = useTitle(undefined);

    return (
        <>
            <footer className="w-full h-fit footer text-neutral-content lg:hidden border-solid border-neutral border-spacing-6">
                <div className="footer-start ">
                    <div className="flex-none ">
                        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost" data-cy="MenuButton">
                            <FiMenu size={25} />
                        </label>
                    </div>
                    {visibleStartNavbarActions.map((x) => (
                        <x.Component key={x.key} />
                    ))}
                </div>
            </footer>

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



export default Footer;