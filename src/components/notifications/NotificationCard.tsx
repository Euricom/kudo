import Link from "next/link";
import { type Notification } from "@prisma/client";
import { BsFillCircleFill } from "react-icons/bs";
import { api } from "~/utils/api";
import avatar from "~/../public/images/AnonymousPicture.jpg";
import { useEffect, useState } from "react";
import { type ImageData } from "~/types";
import Image from "next/image";

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const readNotification = api.notifications.readNotification.useMutation();
  const [imgUrl, setImgUrl] = useState<string>(avatar.src);

  const getTimeAgo = () => {
    const milliseconds = Date.now().valueOf() - notification.time.valueOf();
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(weeks / 52);

    if (years >= 1)
      return years.toString() + ` year${years > 1 ? "s" : ""} ago`;
    if (months >= 1)
      return months.toString() + ` month${months > 1 ? "s" : ""} ago`;
    if (weeks >= 1)
      return weeks.toString() + ` week${weeks > 1 ? "s" : ""} ago`;
    if (days >= 1) return days.toString() + ` day${days > 1 ? "s" : ""} ago`;
    if (hours >= 1)
      return hours.toString() + ` hour${hours > 1 ? "s" : ""} ago`;
    if (minutes >= 1)
      return minutes.toString() + ` minute${minutes > 1 ? "s" : ""} ago`;
    return "less than 1 minute ago";
  };

  useEffect(() => {
    if (notification && notification.photo) {
      fetch("/api/images/" + notification.photo)
        .then((res) => res.json())
        .then((json: ImageData) => setImgUrl(json.dataUrl))
        .catch((e) => console.log(e));
    }
  }, [notification, notification.photo]);

  async function handleRead() {
    if (!notification.read) {
      await readNotification.mutateAsync({ id: notification.id });
    }
  }
  return (
    <>
      <Link
        key={notification.id}
        onClick={() => void handleRead()}
        className="card h-fit w-full bg-base-100 hover:bg-base-200"
        data-cy="Notification"
        href={
          notification.sessionId
            ? "/session/" + notification.sessionId.toString()
            : notification.kudoId
            ? "/kudo/" + notification.kudoId.toString()
            : "/"
        }
      >
        <div className="card-body py-8 px-0 align-middle md:px-2">
          <div className="flex w-full gap-3">
            <div className="avatar relative aspect-square h-1/6 w-1/6">
              <Image
                className="rounded-full"
                src={imgUrl ?? avatar}
                alt="Profile picture"
                fill
              />
            </div>
            <div className="flex w-full flex-col gap-1">
              <h2 className=" pr-4" data-cy="SessionTitle">
                {notification.message}
              </h2>
              <div className="flex flex-wrap gap-1">
                <h3 className="badge-primary badge">{getTimeAgo()}</h3>
              </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-1/2 translate-y-1/2 md:right-2">
            {notification.read ? <></> : <BsFillCircleFill color={"#4570f0"} />}
          </div>
        </div>
      </Link>
    </>
  );
};

export default NotificationCard;
