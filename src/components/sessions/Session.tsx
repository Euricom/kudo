import Link from "next/link";
import { type User, type SessionProps } from "~/types";
import { api } from "~/utils/api";
import Image from 'next/image';
import avatar from '../../contents/images/EMAvatar.jpg'



const SessionCard = ({ session }: SessionProps) => {
    const speaker: User | undefined = api.users.getUserById.useQuery({ id: session.speakerId }).data

    if (!session || !speaker) {
        return <></>
    }
    return (
        <>
            <Link key={session.id} className="card bg-base-100 shadow-xl w-full h-fit md:w-96" data-cy="Session" href={"/session/" + session.id.toString()} >
                <div className="card-body">
                    <h2 className="card-title text-2xl" data-cy='SessionTitle'>{session.title}</h2>
                    <div className="flex w-full gap-3">
                        <div className="avatar">
                            <div className="w-10 rounded-full">
                                <Image
                                    src={avatar}
                                    alt="Profile picture"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="">{speaker.displayName}</h3>
                            {/*Eindstip nog toevoegen?*/}
                            <h3 className="badge badge-primary">{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default SessionCard;