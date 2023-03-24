import React from 'react';
import { MdHomeFilled, MdAccountCircle } from 'react-icons/md';
import Link from 'next/link';


const Footer = () => {
    return (
        <>
        <div>

            <footer className="w-full h-fit footer p-4 border-t-4 border-secondary bg-base-100 lg:hidden fixed bottom-0 z-40">
                <div className="flex flex-row w-full footer-center">
                    <div className="w-1/2">
                        <Link href={"/"} className="btn btn-square btn-ghost justify-center " data-cy="MenuButton">
                            <MdHomeFilled size={25} />
                            <h1>Home</h1>
                        </Link>
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost " data-cy="MenuButton">
                            <MdAccountCircle size={25} />
                            <h1>Account</h1>
                        </label>
                    </div>
                </div>
            </footer>
        </div>
        </>
    );
};



export default Footer;