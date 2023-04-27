import { type PrismaClient } from "@prisma/client"
import { pusherServer } from "~/pusher/pusher.server"
import { getKudosBySessionId } from "./kudoService"


export async function updatePusherKudos(sessionid: string, ctx: { prisma: PrismaClient }) {
    const kudos = await getKudosBySessionId(sessionid, ctx)
    await pusherServer.trigger(`session-${sessionid}`, "kudo-created", {
        kudos: kudos
    })
}