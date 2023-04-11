import { sortDate, sortSpeaker, sortTitle } from "~/server/services/sessionService";
import { type SessionListProps, sortPosibillities } from "~/types";
import { api } from "~/utils/api";
import SessionCard from "~/components/sessions/Session";
import SortAndFilter from "~/components/input/SortAndFilter";
import { useState } from 'react'


const SessionList = ({ sessions, filterIn, sortIn }: SessionListProps) => {
    const users = api.users.getAllUsers.useQuery().data


    const [sort, setSort] = useState<sortPosibillities>(sortIn ?? sortPosibillities.DateD)
    const [filter, setFilter] = useState<string>(filterIn ?? "")


    function sortSessions() {
        switch (sort) {
            case sortPosibillities.TitleA:
            case sortPosibillities.TitleD:
                return (
                    <>
                        <div className="w-full flex flex-wrap gap-4">
                            {sortTitle({ sessions: sessions, sort: sort }).filter(s => (s.title.toLowerCase().includes(filter?.toLowerCase() ?? "")) || (users?.find(u => u.id == s.speakerId)?.displayName.toLowerCase().includes(filter?.toLowerCase() ?? ""))).map((s) =>
                                <SessionCard key={s.id} session={s} />
                            )}
                        </div>
                    </>
                )
            case sortPosibillities.SpeakerA:
            case sortPosibillities.SpeakerD:

                return sortSpeaker({ sessions: sessions.filter(s => (s.title.toLowerCase().includes(filter?.toLowerCase() ?? "")) || (users?.find(u => u.id == s.speakerId)?.displayName.toLowerCase().includes(filter?.toLowerCase() ?? ""))).sort((a, b) => (users?.find(u => u.id === a.speakerId)?.displayName ?? "a") > (users?.find(u => u.id === b.speakerId)?.displayName ?? "b") ? 1 : -1), sort: sort }).map((s) => {
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
                return sortDate({ sessions: sessions.filter(s => (s.title.toLowerCase().includes(filter?.toLowerCase() ?? "")) || (users?.find(u => u.id == s.speakerId)?.displayName.toLowerCase().includes(filter?.toLowerCase() ?? ""))), sort: sort }).map((d) => {
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
            <SortAndFilter sort={sort} setSort={setSort} filter={filter} setFilter={setFilter} />
            <div className="flex flex-col gap-8 h-full justify-start p-5">
                {sortSessions()}
            </div>
        </>
    )
}

export default SessionList;