import React from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { FiBell } from 'react-icons/fi';
import { BsGearFill } from 'react-icons/bs'

function useVisibleNavbarActions() {
    const router = useRouter();
  
    return [
      {
        Component: SearchIcon,
        key: 'searchButton',
        routes: ['/'],
      },
      {
        Component: NotificationIcon,
        key: 'notifButton',
        routes: ['/', '/about'],
      },
    ].filter((item) => item.routes.includes(router.pathname));
  }

interface NavBarProps  { 
    titleContent?: React.ReactNode,
    children?: React.ReactNode 
  }

const NavBar = ({ children, titleContent }: NavBarProps) => {
    const visibleNavbarActions = useVisibleNavbarActions();
    return (
        <>
        <div className="drawer">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" /> 
            <div className="drawer-content flex flex-col">
                <div className="w-full navbar bg-base-300">
                    <div className="navbar-start ">
                        <div className="flex-none lg:hidden">
                            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </label>
                        </div>
                    </div>
                    <div className="navbar-center">
                        <a className="normal-case text-xl">{titleContent}</a>
                    </div>
                    <div className="navbar-end">
                        {visibleNavbarActions.map((x) => (
                            <x.Component key={x.key}/>
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
                {children}
            </div> 
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" className="drawer-overlay">User</label> 
                <div className="menu p-4 w-80 bg-base-100">
                    <div className='flex flex-col'>
                        <div className="avatar">
                            <div className="w-24 rounded-xl">
                                <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>
                        <a>Username</a>
                    </div>
                    <div className="divider"></div> 
                    <a className='grow'>Settings</a>
                    <div className="divider"></div> 
                    <a onClick={() => void signOut()}>Sign out</a>
                </div>
            </div>
        </div>
        </>
    );
};

function SearchIcon() {
    return (
        <>
        <button className="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
        </>
    );
}

function NotificationIcon() {
    return (
        <>
        <button className="btn btn-ghost btn-circle">
        <div className="indicator">
        <FiBell size={20}/>
        <span className="badge badge-sm badge-error border border-collapse border-neutral indicator-item">12</span>
        </div>
        </button>
        </>
    );
}

export default NavBar;