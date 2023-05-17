import { type Template, type Kudo } from "@prisma/client";
import { type Shapes, SortPosibillities } from "~/types";
import { prisma } from "../db";
import { findAllUsers } from "./userService";
import { getAllSessions } from "./sessionService";
import { TRPCError } from "@trpc/server";
import { createCanvas } from "canvas";
import { Image } from "canvas";
import data from "@emoji-mart/data";
import { init, getEmojiDataFromNative } from "emoji-mart";

type emojiData = {
  aliases: string[];
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  skin: number;
  unified: string;
};

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

export async function makeSlackKudo(message: string) {
  await init({ data });
  const template = await prisma.template
    .findMany({
      where: {
        color: {
          not: "#ffffff",
        },
        //lokaal = clhakn1pv0008un18bjfbwr8j online = clhheejmu0002s5fufgxruzpy
        // id: {
        //   not: "clh8viadu0006ungku0w7hvs9",
        // },
      },
    })
    .then((t) => shuffle(t)[0]);
  if (!template) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No template was found.",
    });
  }
  const shapes: Shapes[] = ([...template.content] as unknown as Shapes[]) ?? [];

  const width = 1500;
  const height = 1000;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = template.color;
  context.fillRect(0, 0, width, height);

  shapes.map(async (s) => {
    if (s.type === 5) {
      s.fill ? (context.fillStyle = s.fill) : "";
      context.beginPath();
      context.arc(
        (s.x ?? 0) + 750,
        (s.y ?? 0) + 500,
        s.radius ?? 390,
        0,
        2 * Math.PI
      );
      context.fill();
    } else if (s.type === 2) {
      context.beginPath();
      context.lineWidth = s.thickness ?? 5;
      if (s.points) {
        for (let i = 0; i < s.points?.length ?? 0; i = i + 2) {
          context.lineTo(
            (s.points[i] ?? 0) + 750,
            (s.points[i + 1] ?? 0) + 500
          );
        }
      }
      context.stroke();
    } else if (s.type === 1) {
      const img = new Image();
      await getEmojiDataFromNative(s.text)
        .then((d: emojiData) => {
          img.src =
            "https://github.githubassets.com/images/icons/emoji/unicode/" +
            d.unified +
            ".png?v8";
        })

        .catch((e) => console.log(e));
      img.onload = () => {
        context.drawImage(
          img,
          (s.x ?? 0) + 750 - ((s.fontSize ?? 90) * ((s.scale?.x ?? 2) - 1)) / 2,
          (s.y ?? 0) + 500 - ((s.fontSize ?? 90) * ((s.scale?.x ?? 2) - 1)) / 2,
          (s.fontSize ?? 90) * ((s.scale?.x ?? 2) - 1),
          (s.fontSize ?? 90) * ((s.scale?.y ?? 2) - 1)
        );
      };
    } else {
      let text = s.text;
      if (s.id === "bodyText") {
        text = message;
      }
      s.fill ? (context.fillStyle = s.fill) : "";
      context.font =
        ((s.fontSize ?? 90) * ((s.scale?.y ?? 2) - 1)).toString() +
        "px " +
        (s.fontFamily ?? "Arial").toString();
      const textWidth = context.measureText(text ?? "fout").width;
      context.fillText(
        text ?? "fout",
        (s.x ?? 0) + 750 - textWidth / 2,
        (s.y ?? 0) + 500 + (s.fontSize ?? 0) / 3
      );
    }
  });
  await delay(3000);
  const buffer = canvas.toBuffer("image/jpeg");
  const base64String = btoa(String.fromCharCode(...new Uint8Array(buffer)));

  return base64String;
}

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

export async function getAllTemplates() {
  return await prisma.template.findMany({});
}
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
