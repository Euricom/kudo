import { sortPosibillities, type newSessionDate, type newSessionSpeaker, type SessionArray } from "~/types"


export function sortDate({ sessions, sort }: SessionArray) {
    const sorted = sessions.reduce((previous, current) => {
        if (previous[previous.length - 1]?.date !== current.date) {
            return [...previous, { date: current.date, sessions: sessions.filter(s => s.date === current.date) }]
        }
        else return previous
    }, [] as newSessionDate[])

    if (sort === sortPosibillities.DateA) {
        return sorted.reverse()
    }
    return sorted
}
export function sortTitle({ sessions, sort }: SessionArray) {
    const sorted = sessions.sort((a, b) => a.title > b.title ? 1 : -1)
    if (sort === sortPosibillities.TitleD) {
        return sorted.reverse()
    }
    return sorted
}
export function sortSpeaker({ sessions, sort }: SessionArray) {
    const sorted = sessions.reduce((previous, current) => {
        if (previous[previous.length - 1]?.speakerId !== current.speakerId) {
            return [...previous, { speakerId: current.speakerId, sessions: sessions.filter(s => s.speakerId === current.speakerId) }]
        }
        else return previous
    }, [] as newSessionSpeaker[])
    if (sort === sortPosibillities.SpeakerD) {
        return sorted.reverse()
    }
    return sorted
}

