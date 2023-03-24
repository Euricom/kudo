import React from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { MdHomeFilled, MdAccountCircle } from 'react-icons/md';
import { FiBell, FiMenu, FiDownload } from 'react-icons/fi';
import { BsGearFill, BsArrowLeft } from 'react-icons/bs'
import Image from 'next/image';
import avatar from '../contents/images/EMAvatar.jpg'
import { useUtilButtons } from '~/hooks/useUtilButtons';

import { useTitle } from "./NavBarTitle";
import Link from 'next/link';



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
            <div className='divider'></div>
            <footer className="w-full h-14 footer footer-center lg:hidden">
                <Link href={"/"} className="grid grid-cols-2 footer-start w-full">
                    <Link href={"/"} className="footer-center w-1/2 " onClick={() => alert("hier")}>
                        <div className="mb-4 btn btn-square btn-ghost justify-center mr-5" data-cy="MenuButton">
                            <MdHomeFilled size={25} />
                            <h1>Home</h1>
                        </div>
                    </Link>
                    <div className="grid w-1/2 footer-center">
                        <label className=" mb-4 btn btn-square btn-ghost ml-5" data-cy="MenuButton">
                            <MdAccountCircle size={25} />
                            <h1>Account</h1>
                        </label>
                    </div>
                </Link>
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