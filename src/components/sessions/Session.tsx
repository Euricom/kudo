import Link from "next/link";
import { type SessionProps } from "~/types";
import { api } from "~/utils/api";
import Image from 'next/image';
import avatar from '~/contents/images/AnonymousPicture.jpg'



const SessionCard = ({ session }: SessionProps) => {
    const speaker = api.users.getUserById.useQuery({ id: session.speakerId }).data
    if (!session || !speaker) {
        return <></>
    }

    return (
        <>
            <Link key={session.id} className="card bg-base-100 shadow-xl w-full h-fit md:w-96" data-cy="Session" href={"/session/" + session.id.toString()} >
                <div className="card-body">
                    <h2 className="card-title text-2xl" data-cy='SessionTitle'>{session.title}</h2>
                    <div className="flex w-full gap-3">
                        <div className="avatar w-12 aspect-square relative">
                            <Image
                                className="rounded-full"
                                src={session.speaker?.image ?? avatar}
                                alt="Profile picture"
                                fill
                            />
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