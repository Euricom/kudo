import { Template, type Kudo } from "@prisma/client";
import { EditorFunctions, Shapes, SortPosibillities } from "~/types";
import { prisma } from "../db";
import { findAllUsers } from "./userService";
import { getAllSessions } from "./sessionService";
import { TRPCError } from "@trpc/server";
import KonvaCanvas from "~/components/editor/KonvaCanvas";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";

export const findAllKudosSortedByUserId = async (
  userid: string,
  sort?: SortPosibillities
): Promise<Kudo[]> => {
  const kudos = await prisma.kudo.findMany({
    where: {
      userId: userid,
    },
    orderBy: {
      id: "desc",
    },
  });
  const sessions = await getAllSessions();
  const users = await findAllUsers();
  if (!kudos || !users) {
    console.log("No kudos or users found");
    return [];
  }

  switch (sort) {
    case SortPosibillities.TitleA:
      return kudos.sort((a, b) =>
        (sessions?.find((s) => s.id === a.sessionId)?.title ?? "a") <
        (sessions?.find((s) => s.id === b.sessionId)?.title ?? "b")
          ? 1
          : -1
      );
    case SortPosibillities.TitleD:
      return kudos.sort((a, b) =>
        (sessions?.find((s) => s.id === a.sessionId)?.title ?? "a") >
        (sessions?.find((s) => s.id === b.sessionId)?.title ?? "b")
          ? 1
          : -1
      );
    case SortPosibillities.SpeakerA:
      return kudos.sort((a, b) =>
        (users.find(
          (u) => u.id === sessions?.find((s) => s.id === a.sessionId)?.speakerId
        )?.displayName ?? "a") <
        (users.find(
          (u) => u.id === sessions?.find((s) => s.id === b.sessionId)?.speakerId
        )?.displayName ?? "b")
          ? 1
          : -1
      );
    case SortPosibillities.SpeakerD:
      return kudos.sort((a, b) =>
        (users.find(
          (u) => u.id === sessions?.find((s) => s.id === a.sessionId)?.speakerId
        )?.displayName ?? "a") >
        (users.find(
          (u) => u.id === sessions?.find((s) => s.id === b.sessionId)?.speakerId
        )?.displayName ?? "b")
          ? 1
          : -1
      );
    case SortPosibillities.DateA:
      return kudos.sort((a, b) =>
        (sessions?.find((s) => s.id === a.sessionId)?.date ?? 1) <
        (sessions?.find((s) => s.id === b.sessionId)?.date ?? 2)
          ? -1
          : 1
      );
    default:
      return kudos.sort((a, b) =>
        (sessions?.find((s) => s.id === a.sessionId)?.date ?? 1) >
        (sessions?.find((s) => s.id === b.sessionId)?.date ?? 2)
          ? -1
          : 1
      );
  }
};

export function getKudosBySessionId(sessionId: string) {
  return prisma.kudo.findMany({
    where: {
      sessionId: sessionId,
    },
    orderBy: {
      id: "desc",
    },
  });
}

export function getFirstImageById() {
  return prisma.image.findUnique({
    where: {
      id: "clgw23or80004n0imq1wzj9ec",
    },
  });
}

// export async function makeSlackKudo(message: string) {
//   let editorFunction = EditorFunctions.None;
//   const setFunction = (func: EditorFunctions) => {
//     editorFunction = func;
//   };
//   let staged: Stage = Stage;
//   const setStage = (stage: Stage) => {
//     staged = stage;
//   };
//   const template = await prisma.template
//     .findMany({
//       where: {
//         id: {
//           not: "clh7cwbgx0006o6k8hk6dwphn",
//         },
//       },
//     })
//     .then((t) => shuffle(t)[0]);
//   if (!template) {
//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       message: "No template was found.",
//     });
//   }
//   const shapes: Shapes[] = ([...template.content] as unknown as Shapes[]) ?? [];

//   shapes.map((s) => (s.id === "bodyText" ? (s.text = message) : ""));
//   // template.content = shapes

//   const konva = KonvaCanvas({
//     editorFunction: editorFunction,
//     template: template,
//     color: template.color,
//     setFunction: setFunction,
//     setStage
//   });
// }

const shuffle = (array: Template[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp1 = array[i];
    const temp2 = array[i];
    if (!temp2 || !temp1) {
      return array;
    }
    array[i] = temp2;
    array[j] = temp1;
  }
  return array;
};
