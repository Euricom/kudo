import Link from "next/link";
import { type User, type SessionProps } from "~/types";
import { api } from "~/utils/api";



const Session = ({ session }: SessionProps) => {
    const speaker: User | undefined = api.users.getUserById.useQuery({ id: session.speakerId }).data



    if (!session || !speaker) {
        return <></>
    }
    return (
        <>
            <Link className="card bg-base-200 shadow-xl w-full h-fit md:w-96 bg-honeycomb bg-cover" data-cy="Session" href={"/session/" + session.id.toString()} >
                <div className="card bg-white bg-opacity-50 backdrop-blur-xs">
                    <div className="card-body">
                        <h2 className="card-title justify-center text-2xl bold text-black">{session.title}</h2>
                        <div className="flex justify-between w-full">
                            <a className="text-lg">{speaker.displayName}</a>
                            <a className="text-lg">{new Date(session.date).toLocaleDateString()}</a>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default Session;