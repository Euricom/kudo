import Link from "next/link";
import { type User, type SessionProps } from "~/types";
import { api } from "~/utils/api";
import Image from "next/image";
import avatar from "~/../public/images/AnonymousPicture.jpg";

const SessionCard = ({ session }: SessionProps) => {
  const speakers: User[] | undefined = api.users.getUserByIds.useQuery({
    ids: session.speakerId,
  }).data;

  if (!session || !speakers) {
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
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-2">
              {speakers.map((speaker) => (
                <>
                  <div className="flex items-center gap-3">
                    <div className="avatar relative aspect-square w-12">
                      <Image
                        className="rounded-full"
                        src={"/api/images/" + speaker.id ?? avatar}
                        alt="Profile picture"
                        fill
                      />
                    </div>
                    <h3 className="">{speaker.displayName}</h3>
                  </div>
                </>
              ))}
            </div>
            <h3 className="badge-primary badge">
              {new Date(session.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h3>
          </div>
        </div>
      </Link>
    </>
  );
};

export default SessionCard;
