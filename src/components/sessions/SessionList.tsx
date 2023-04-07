import { sortDate, sortSpeaker, sortTitle } from "~/server/services/sessionService";
import { pages, sortPosibillities, type SessionArray } from "~/types";
import { api } from "~/utils/api";
import SessionCard from "~/components/sessions/Session";
import SortAndFilter from "~/components/input/SortAndFilter";
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { useFilters } from "../input/RememberFilter";


const SessionList = ({ sessions }: SessionArray) => {
    const router = useRouter()
    const users = api.users.getAllUsers.useQuery().data

    const pageString = router.asPath
    let page = pages.In
    switch (pageString) {
        case ("/all"): page = pages.All
            break;
        case ("/"): page = pages.In
            break;
        default: page = pages.In
    }


    const data = useFilters().data
    let index = -1
    if (data.pages.includes(page)) {
        index = data.pages.indexOf(page)
    }
    const [sort, setSort] = useState<sortPosibillities>(data.sorts[index] ?? sortPosibillities.DateD)
    const [filter, setFilter] = useState<string>(data.filters[index] ?? "")

    useEffect(() => {
        if (data.pages.includes(page)) {
            const index = data.pages.indexOf(page)
            setFilter(data.filters[index] ?? "")
            setSort(data.sorts[index] ?? sortPosibillities.DateD)

        }
    }, [data.pages, data.filters, data.sorts, page])


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
            <SortAndFilter page={page} sort={sort} setSort={setSort} filter={filter} setFilter={setFilter} />
            <div className="flex flex-col gap-8 h-full justify-start p-5">
                {sortSessions()}
            </div>
        </>
    )
}

export default SessionList;