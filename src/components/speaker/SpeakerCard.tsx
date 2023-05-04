import Link from "next/link";
import { type UserWCount } from "~/types";
import Image from "next/image";
import avatar from "~/../public/images/AnonymousPicture.jpg";

const SpeakerCard = ({ user }: { user: UserWCount }) => {
  return (
    <>
      <Link
        key={user.user.id}
        className="card h-fit w-full bg-base-100 shadow-xl md:w-96"
        data-cy="Session"
        href={"/speaker/" + user.user.id.toString()}
      >
        <div className="card-body">
          <div className="flex w-full gap-3">
            <div className="avatar aspect-square h-1/6 w-1/4">
              <div className="relative">
                <Image
                  className="rounded-full"
                  src={"/api/images/" + user.user.id ?? avatar}
                  alt="Profile picture"
                  fill
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="card-title text-2xl" data-cy="SessionTitle">
                {user.user.displayName}
              </h2>
              <div className="flex flex-wrap gap-1">
                <h3 className="badge-primary badge">
                  Sessies: {user.sessionCount}
                </h3>
                <h3 className="badge-primary badge">
                  Send: {user.sendKudoCount}
                </h3>
                <h3 className="badge-primary badge">
                  Received: {user.receiveKudoCount}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default SpeakerCard;
