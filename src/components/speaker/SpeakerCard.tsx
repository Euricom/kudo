import Link from "next/link";
import { type UserWCount } from "~/types";
import Image from 'next/image';
import avatar from '../../contents/images/EMAvatar.jpg'



const SpeakerCard = ({ user }: {user: UserWCount}) => {
    return (
        <>
            <Link key={user.user.id} className="card bg-base-100 shadow-xl w-full h-fit md:w-96" data-cy="Session" href={"/speaker/" + user.user.id.toString()} >
                <div className="card-body">
                    <div className="flex w-full gap-3">
                        <div className="avatar w-1/4">
                            <div className="rounded-full">
                                <Image
                                    src={avatar}
                                    alt="Profile picture"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <h2 className="card-title text-2xl" data-cy='SessionTitle'>{user.user.displayName}</h2>
                            <div className="flex flex-wrap gap-1">
                                <h3 className="badge badge-primary">Sessies: {user.sessionCount}</h3>
                                <h3 className="badge badge-primary">Send: {user.sendKudoCount}</h3>
                                <h3 className="badge badge-primary">Received: {user.receiveKudoCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default SpeakerCard;