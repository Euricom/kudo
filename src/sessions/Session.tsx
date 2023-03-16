import Link from "next/link";

type session = {
    id: number,
    title: string,
    date: string,
    speakerId: string,
}
interface SessionProps {
    session: session
}

const Session = ({ session }: SessionProps) => {
    console.log(session);
    if (!session) {
        return <><div>Error</div></>
    }
    return (
        <>
            <Link className="card bg-base-200 shadow-xl w-full h-fit md:w-96 bg-honeycomb bg-cover" data-cy="Session" href={"/session/" + session.id.toString()} >
                <div className="card bg-white bg-opacity-50 backdrop-blur-xs">
                    <div className="card-body">
                        <h2 className="card-title justify-center text-2xl bold text-black">{session.title}</h2>
                        <div className="flex justify-between w-full">
                            <a className="text-lg">{session.speakerId}</a>
                            <a className="text-lg">{new Date(session.date).toLocaleDateString()}</a>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default Session;