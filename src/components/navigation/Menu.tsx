import Image from 'next/image';
import React from 'react';
import { type MenuProps } from '~/types';
import avatar from '../../contents/images/EMAvatar.jpg'
import { signOut } from 'next-auth/react';
import ThemeButton from '~/components/input/ThemeButton';




const Menu = ({ children }: MenuProps) => {
    return (
        <>
            <div className="drawer" data-cy='Menu'>
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content overflow-hidden flex flex-col">
                    {children}
                </div>
                <div className="drawer-side w-full ">
                    <label htmlFor="my-drawer-3" className="drawer-overlay">User</label>
                    <div className="menu p-4 w-full bg-base-100 text-lg">
                        <label className='btn btn-circle absolute top-3 right-3 btn-ghost text-2xl' htmlFor="my-drawer-3" data-cy='CloseMenu'>X</label>
                        <div className='flex flex-col w-fit'>
                            <div className="avatar ">
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
                                <ThemeButton />
                            </div>
                        </div>
                        <div className="divider"></div>
                        <a onClick={() => void signOut()} data-cy='SignOut'>Sign out</a>
                    </div>
                </div>
            </div>

        </>

    )
}

export default Menu