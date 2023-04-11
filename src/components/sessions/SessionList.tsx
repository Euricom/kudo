import { sortDate, sortSpeaker, sortTitle } from "~/server/services/sessionService";
import { type Session, SortPosibillities, type SessionArray } from "~/types";
import { api } from "~/utils/api";
import SessionCard from "~/components/sessions/Session";
import SortAndFilter from "~/components/input/SortAndFilter";
import { useState } from 'react'


const SessionList = ({ sessions }: SessionArray) => {
    const users = api.users.getAllUsers.useQuery().data

    const [sort, setSort] = useState<SortPosibillities>(SortPosibillities.DateD)
    const [filter, setFilter] = useState<string>("")

    function filtering(sessions: Session[]) {
        //Moet het in het nederlands gecheckt worden? zoja commentaar toevoegen.
        return sessions.filter(s => (new Date(s.date).toLocaleString('en-GB', { month: 'long' }).toLowerCase().includes(filter?.toLowerCase() ?? "")) /*|| (new Date(s.date).toLocaleString('nl-NL', { month: 'long' }).toLowerCase().includes(filter?.toLowerCase() ?? "")) */ || (new Date(s.date).toLocaleDateString('en-GB').toLowerCase().includes(filter?.toLowerCase() ?? "")) || (new Date(s.date).toDateString().toLowerCase().includes(filter?.toLowerCase() ?? "")) || (s.title.toLowerCase().includes(filter?.toLowerCase() ?? "")) || (users?.find(u => u.id == s.speakerId)?.displayName.toLowerCase().includes(filter?.toLowerCase() ?? "")))
    }


    function sortSessions() {
        switch (sort) {
            case SortPosibillities.TitleA:
            case SortPosibillities.TitleD:
                return (
                    <>
                        <div className="w-full flex flex-wrap gap-4">
                            {filtering(sortTitle({ sessions: sessions, sort: sort })).map((s) =>
                                <SessionCard key={s.id} session={s} />
                            )}
                        </div>
                    </>
                )
            case SortPosibillities.SpeakerA:
            case SortPosibillities.SpeakerD:

                return sortSpeaker({ sessions: filtering(sessions).sort((a, b) => (users?.find(u => u.id === a.speakerId)?.displayName ?? "a") > (users?.find(u => u.id === b.speakerId)?.displayName ?? "b") ? 1 : -1), sort: sort }).map((s) => {
                    const speaker = users?.find(u => u.id === s.speakerId);
                    return (
                        <>
                            <div key={s.speakerId} className="">
                                <h2 className="w-full">{speaker?.displayName}</h2>
                                <div className="flex flex-wrap gap-4">
                                    {s.sessions.map(s => {
                                        return <SessionCard key={s.id} session={s} />
                                    })}
                                </div>
                            </div>
                        </>
                    )
                })
            default:
                return sortDate({ sessions: filtering(sessions), sort: sort }).map((d) => {
                    const sessionDate = new Date(d.date);
                    return (
                        <>
                            <div key={d.date} className="">
                                <h2 className="w-full">{sessionDate.toLocaleDateString() == new Date().toLocaleDateString() ? 'Today' : sessionDate.toDateString()}</h2>
                                <div className="flex flex-wrap gap-4">
                                    {d.sessions.map(s => {
                                        return <SessionCard key={s.id} session={s} />
                                    })}
                                </div>
                            </div>
                        </>
                    )
                })
        }

    }
    return (
        <>
            <SortAndFilter setSort={setSort} filter={filter} setFilter={setFilter} />
            <div className="flex flex-col gap-8 h-full justify-start p-5">
                {sortSessions()}
            </div>
        </>
    )
}

export default SessionList;