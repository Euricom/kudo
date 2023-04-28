import { type Kudo } from "@prisma/client";
import { pusherServer } from "~/pusher/pusher.server";

export async function createPusherKudo(kudo: Kudo) {
  await pusherServer.trigger(`session-${kudo.sessionId}`, "kudo-created", {
    kudo: kudo,
  });
}

export async function deletePusherKudo(kudo: Kudo) {
  await pusherServer.trigger(`session-${kudo.sessionId}`, "kudo-deleted", {
    kudo: kudo,
  });
}
