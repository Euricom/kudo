import { type Kudo } from "@prisma/client";
import { sortPosibillities } from "~/types";
import { api } from "~/utils/api";



export const FindAllKudosSortedByUserId = (id: string, sort: sortPosibillities): Kudo[] => {
    const kudoQuery = api.kudos.getKudosByUserId.useQuery({ id: id });
    const kudos: Kudo[] = kudoQuery.data as Kudo[]
    const sessions = api.sessions.getAll.useQuery().data
    const users = api.users.getAllUsers.useQuery().data

    let sortedKudos: Kudo[] = []

    if (!kudos || !users) {
        return kudos
    }

    switch (sort) {
        case sortPosibillities.TitleA:
        case sortPosibillities.TitleD:
            sortedKudos = kudos.sort((a, b) => ((sessions?.find(s => s.id === a.sessionId)?.title ?? "a") < (sessions?.find(s => s.id === b.sessionId)?.title ?? "b")) ? 1 : -1)
            if (sort === sortPosibillities.TitleD)
                return sortedKudos.reverse()
            return sortedKudos
        case sortPosibillities.SpeakerA:
        case sortPosibillities.SpeakerD:
            sortedKudos = kudos.sort((a, b) => ((users.find(u => u.id === sessions?.find(s => s.id === a.sessionId)?.speakerId)?.displayName ?? "a") < (users.find(u => u.id === sessions?.find(s => s.id === b.sessionId)?.speakerId)?.displayName ?? "b")) ? 1 : -1)
            if (sort === sortPosibillities.SpeakerD)
                return sortedKudos.reverse()
            return sortedKudos
        case sortPosibillities.DateA:
        default:
            sortedKudos = kudos.sort((a, b) => ((sessions?.find(s => s.id === a.sessionId)?.date ?? 1) < (sessions?.find(s => s.id === b.sessionId)?.date ?? 2)) ? -1 : 1)
            if (sort === sortPosibillities.DateA)
                return sortedKudos.reverse()
            return sortedKudos
    }
};

