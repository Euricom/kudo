import { pusherServer } from "~/pusher/pusher.server"
import { getKudosBySessionId } from "./kudoService"


export async function updatePusherKudos(sessionid: string) {
    const kudos = await getKudosBySessionId(sessionid)
    await pusherServer.trigger(`session-${sessionid}`, "kudo-created", {
        kudos: kudos
    })
}