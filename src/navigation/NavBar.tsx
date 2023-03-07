import React from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { FiBell, FiMenu, FiDownload } from 'react-icons/fi';
import { BsGearFill } from 'react-icons/bs'
import Image from 'next/image';
import avatar from '../contents/images/EMAvatar.jpg'
import useVisibleButtons from '~/hooks/useVisibleButtons';
import NavButtons from './NavButtons';

function useVisibleNavbarActions() {
    const router = useRouter();

    return [
        {
            Component: NotificationIcon,
            key: 'notifButton',
            routes: ['/', '/out', '/all'],
        },
        {
            Component: DownloadIcon,
            key: 'downladButton',
            routes: ['/session/[...id]'],
        },
    ].filter((item) => item.routes.includes(router.pathname));
}

function useTitleContent() {
    const router = useRouter();

    return [
        {
            route: '/',
            Component: () => <NavButtons />,
        },
        {
            route: '/out',
            Component: () => <NavButtons />,
        },
        {
            route: '/all',
            Component: () => <NavButtons />,
        },
        {
            route: '/notifications',
            Component: () => <>Notifications</>,
        },
        {
            route: '/create',
            Component: () => <>New Kudo</>,
        },
        {
            route: '/create/templates',
            Component: () => <>Templates</>,
        },
        {
            route: '/create/editor',
            Component: () => <>Editor</>,
        },
        {
            route: '/kudo/*',
            Component: () => <>Kudo: </>,
        },
        {
            route: '/session/*',
            Component: () => <>Session: </>,
        },
    ].filter((item) => item.route === router.pathname).pop();
}

interface NavBarProps {
    children?: React.ReactNode
}

const NavBar = ({ children }: NavBarProps) => {
    const buttons = useVisibleButtons();
    const visibleNavbarActions = useVisibleNavbarActions();
    const titleContent = useTitleContent();
    console.log(titleContent);
    
    return (
        <>
            <div className="drawer">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    <div className="w-full navbar bg-neutral text-neutral-content">
                        <div className="navbar-start ">
                            <div className="flex-none lg:hidden">
                                <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                                    <FiMenu size={25}/>
                                </label>
                            </div>
                        </div>
                        <div className="navbar-center">
                            <a className="normal-case text-xl">{titleContent? <titleContent.Component /> : ''}</a>
                        </div>
                        <div className="navbar-end">
                            {visibleNavbarActions.map((x) => (
                                <x.Component key={x.key} />
                            ))}
                            <div className="hidden lg:inline-flex">
                                <button className="btn btn-ghost btn-circle">
                                    <BsGearFill />
                                </button>
                                <button className="btn btn-ghost" onClick={() => void signOut()}>
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-1/4 my-2 pt-16 z-50 flex">
                        {buttons.map((x) => (
                            <x.Component key={x.key} />
                        ))}
                    </div>
                    {children}
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-3" className="drawer-overlay">User</label>
                    <div className="menu p-4 w-80 bg-base-100 text-lg">
                        <div className='flex flex-col'>
                            <div className="avatar">
                                <div className="w-24 rounded-xl">
                                    <Image 
                                    src={avatar}
                                    alt="Profile picture"  
                                    />
                                </div>
                            </div>
                            <a>Yi Long Ma</a>
                        </div>
                        <div className="divider"></div>
                        <div className='grow flex flex-col gap-3'>
                            <a>Settings</a>
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <span className="label-text">Notifications</span> 
                                    <input type="checkbox" className="toggle" />
                                </label>
                                <label className="label cursor-pointer">
                                    <span className="label-text">Darkmode</span> 
                                    <input type="checkbox" className="toggle" />
                                </label>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <a onClick={() => void signOut()}>Sign out</a>
                    </div>
                </div>
            </div>
        </>
    );
};

function NotificationIcon() {
    return (
        <>
            <button className="btn btn-ghost btn-circle">
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
            <button className="btn btn-ghost btn-circle">
                <FiDownload size={20} />
            </button>
        </>
    );
}

export default NavBar;