import Session from "~/sessions/Session";
import { type SessionArray } from "~/types";

const SessionList = ({ sessions }: SessionArray) => {

    let currentDate = '';

    return (
        <>
            <div className="flex flex-wrap gap-8 h-full justify-center p-5">
                {sessions.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()).map((x) => {
                    const sessionDate = new Date(x.date).toLocaleDateString();

                    if (currentDate !== sessionDate) {
                        currentDate = sessionDate;
                        return (
                            <>
                                <h2 className="w-full text-3xl text-center">{sessionDate == new Date().toLocaleDateString() ? 'Today' : sessionDate}</h2>
                                <Session session={x} key={x.id} />
                            </>
                        );
                    }

                    return (
                        <Session session={x} key={x.id} />
                    )
                })}
            </div>
        </>
    )
}

export default SessionList;