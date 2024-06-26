import Image from "next/image";
import { type MenuProps } from "~/types";
import { signOut, useSession } from "next-auth/react";
import ThemeButton from "~/components/input/ThemeButton";

const Menu = ({ children }: MenuProps) => {
  const userId: string = useSession().data?.user.id ?? "";

  const user = useSession().data?.user;

  return (
    <>
      <div className="drawer" data-cy="Menu">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col overflow-hidden">
          {children}
        </div>
        <div className="drawer-side w-full ">
          <label htmlFor="my-drawer-3" className="drawer-overlay">
            User
          </label>
          <div className="menu w-full bg-base-100 p-4 text-lg">
            <label
              className="btn-ghost btn-circle btn absolute top-3 right-3 text-2xl"
              htmlFor="my-drawer-3"
              data-cy="CloseMenu"
            >
              X
            </label>
            <div className="flex w-fit flex-col">
              <div className="avatar ">
                <div className="relative w-24 rounded-xl">
                  <Image
                    src={"/api/images/" + userId}
                    alt="Profile picture"
                    fill
                  />
                </div>
              </div>
              <a>{user?.name}</a>
            </div>

            <div className="divider"></div>
            <div className="flex grow flex-col gap-3">
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
            <a onClick={() => void signOut()} data-cy="SignOut">
              Sign out
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
