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
            <div className="flex flex-col gap-8 h-full justify-start p-5">
                {sortedSessions.map((d) => {
                    const sessionDate = new Date(d.date);
                    return (
                        <>
                            <div key={d.date} className="">
                                <h2 className="w-full">{sessionDate.toLocaleDateString() == new Date().toLocaleDateString() ? 'Today' : sessionDate.toDateString()}</h2>
                                <div className="flex flex-wrap gap-4">
                                    {d.sessions.map(s => {
                                        return <SessionCard key={s.id} session={s}/>
                                    })}
                                </div>
                            </div>
                        </>
                    )
                })}
            </div>
        </>
    )
}

export default SessionList;