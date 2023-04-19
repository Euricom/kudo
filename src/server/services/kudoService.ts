import { type Kudo } from "@prisma/client";
import { type Session, SortPosibillities, type User } from "~/types";

export const FindAllKudosSortedByUserId = (sort: SortPosibillities, kudos?: Kudo[], sessions?: Session[], users?: User[],): Kudo[] => {


    if (!kudos || !users) {
        return []
    }

    switch (sort) {
        case SortPosibillities.TitleA:
            return kudos.sort((a, b) => ((sessions?.find(s => s.id === a.sessionId)?.title ?? "a") < (sessions?.find(s => s.id === b.sessionId)?.title ?? "b")) ? 1 : -1)
        case SortPosibillities.TitleD:
            return kudos.sort((a, b) => ((sessions?.find(s => s.id === a.sessionId)?.title ?? "a") > (sessions?.find(s => s.id === b.sessionId)?.title ?? "b")) ? 1 : -1)
        case SortPosibillities.SpeakerA:
            return kudos.sort((a, b) => ((users.find(u => u.id === sessions?.find(s => s.id === a.sessionId)?.speakerId)?.displayName ?? "a") < (users.find(u => u.id === sessions?.find(s => s.id === b.sessionId)?.speakerId)?.displayName ?? "b")) ? 1 : -1)
        case SortPosibillities.SpeakerD:
            return kudos.sort((a, b) => ((users.find(u => u.id === sessions?.find(s => s.id === a.sessionId)?.speakerId)?.displayName ?? "a") > (users.find(u => u.id === sessions?.find(s => s.id === b.sessionId)?.speakerId)?.displayName ?? "b")) ? 1 : -1)
        case SortPosibillities.DateA:
            return kudos.sort((a, b) => ((sessions?.find(s => s.id === a.sessionId)?.date ?? 1) < (sessions?.find(s => s.id === b.sessionId)?.date ?? 2)) ? -1 : 1)
        default:
            return kudos.sort((a, b) => ((sessions?.find(s => s.id === a.sessionId)?.date ?? 1) > (sessions?.find(s => s.id === b.sessionId)?.date ?? 2)) ? -1 : 1)
    }
};

