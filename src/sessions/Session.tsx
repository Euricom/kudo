import Link from "next/link";
interface SessionProps {
    id: number
}

const Session = ({ id }: SessionProps) => {
    return (
        <>
            <Link className="card bg-base-200 shadow-xl w-full h-fit md:w-96 bg-honeycomb bg-cover" data-cy="Session" href={"/session/" + id.toString()} >
                <div className="card bg-white bg-opacity-50 backdrop-blur-xs">
                    <div className="card-body">
                        <h2 className="card-title justify-center text-2xl bold text-black">Title Session</h2>
                        <div className="flex">
                            <p className="text-lg">Name Speaker</p>
                            <p className="text-lg">Time slot</p>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
};

export default Session;