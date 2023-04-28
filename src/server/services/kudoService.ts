import { type Kudo } from "@prisma/client";
import { SortPosibillities } from "~/types";
import { prisma } from "../db";
import { findAllUsers } from "./userService";

export const findAllKudosSortedByUserId = async (userid: string, sort: SortPosibillities): Promise<Kudo[]> => {
    const kudos = await prisma.kudo.findMany({
        where: {
            userId: userid,
        },
        orderBy: {
            id: 'desc'
        }
    });
    const sessions = getAllSessions();
    const users = await findAllUsers();
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

export function getKudosBySessionId(sessionId: string) {
    return prisma.kudo.findMany({
        where: {
            sessionId: sessionId,
        },
        orderBy: {
            id: 'desc'
        }
    });
}

