import Link from "next/link";
import { type User, type SessionProps, type ImageData } from "~/types";
import { api } from "~/utils/api";
import Image from "next/image";
import avatar from "~/contents/images/AnonymousPicture.jpg";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SessionCard = ({ session }: SessionProps) => {
  const speaker: User | undefined = api.users.getUserById.useQuery({
    id: session.speakerId,
  }).data;
  const [imgUrl, setImgUrl] = useState<string>(avatar.src);

  useEffect(() => {
    if (speaker && speaker.id) {
      fetch("/api/images/" + speaker.id)
        .then((res) => res.json())
        .then((json: ImageData) => setImgUrl(json.dataUrl))
        .catch((e) => toast.error((e as Error).message));
    }
  }, [speaker]);

  if (!session || !speaker) {
    return <></>;
  }

  return (
    <>
      <Link
        key={session.id}
        className="card h-fit w-full bg-base-100 shadow-xl md:w-96"
        data-cy="Session"
        data-title={session.id}
        href={"/session/" + session.id.toString()}
      >
        <div className="card-body">
          <h2 className="card-title text-2xl" data-cy="SessionTitle">
            {session.title}
          </h2>
          <div className="flex w-full gap-3">
            <div className="avatar relative aspect-square w-12">
              <Image
                className="rounded-full"
                src={imgUrl ?? avatar}
                alt="Profile picture"
                fill
              />
            </div>
            <div>
              <h3 className="">{speaker.displayName}</h3>
              {/*Eindstip nog toevoegen?*/}
              <h3 className="badge-primary badge">
                {new Date(session.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default SessionCard;
