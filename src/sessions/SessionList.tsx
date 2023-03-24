import SessionCard from "~/sessions/Session";
import { type newSession, type SessionArray } from "~/types";





const SessionList = ({ sessions }: SessionArray) => {

    let currentDate = '';

    const sortedSessions = sessions.reduce((previous, current) => {
        if (previous[previous.length - 1]?.date !== current.date) {
            return [...previous, { date: current.date, sessions: sessions.filter(s => s.date === current.date) }]
        }
        else return previous


    }, [] as newSession[])
    console.log(sortedSessions);

    return (
        <>
            <div className="flex flex-wrap gap-8 h-full justify-center p-5">
                {sortedSessions.map((x) => {
                    const sessionDate = new Date(x.date).toLocaleDateString();

                    if (currentDate !== sessionDate) {
                        currentDate = sessionDate;
                        return (
                            <>
                                <h2 className="w-full text-3xl text-center">{sessionDate == new Date().toLocaleDateString() ? 'Today' : sessionDate}</h2>
                                {x.sessions.map(x => {
                                    return <SessionCard session={x} key={x.id} />
                                })}
                            </>
                        );
                    }

                    {
                        x.sessions.map(x => {
                            return <SessionCard session={x} key={x.id} />
                        })
                    }

                })}
            </div>
        </>
    )
}

export default SessionList;