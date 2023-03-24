import SessionCard from "~/sessions/Session";
import { type newSession, type SessionArray } from "~/types";





const SessionList = ({ sessions }: SessionArray) => {

    const sortedSessions = sessions.reduce((previous, current) => {
        if (previous[previous.length - 1]?.date !== current.date) {
            return [...previous, { date: current.date, sessions: sessions.filter(s => s.date === current.date) }]
        }
        else return previous
    }, [] as newSession[])

    return (
        <>
            <div className="flex flex-wrap gap-8 h-full justify-center p-5">
                {sortedSessions.map((d) => {
                    const sessionDate = new Date(d.date).toLocaleDateString();
                    return (
                        <>
                            <h2 key={d.date} className="w-full text-3xl text-center">{sessionDate == new Date().toLocaleDateString() ? 'Today' : sessionDate}</h2>
                            {d.sessions.map(s => {
                                return <SessionCard key={s.id} session={s}/>
                            })}
                        </>
                    )
                })}
            </div>
        </>
    )
}

export default SessionList;