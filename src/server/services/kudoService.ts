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
          //Kan zijn dat dit nog niet klopt omdat er meerdere speakers zijn
          (u) =>
            sessions
              ?.find((s) => s.id === a.sessionId)
              ?.speakerId.includes(u.id)
        )?.displayName ?? "a") <
        (users.find((u) =>
          sessions?.find((s) => s.id === b.sessionId)?.speakerId.includes(u.id)
        )?.displayName ?? "b")
          ? 1
          : -1
      );
    case SortPosibillities.SpeakerD:
      return kudos.sort((a, b) =>
        (users.find((u) =>
          sessions?.find((s) => s.id === a.sessionId)?.speakerId.includes(u.id)
        )?.displayName ?? "a") >
        (users.find((u) =>
          sessions?.find((s) => s.id === b.sessionId)?.speakerId.includes(u.id)
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

type Messages = {
  id: string;
  text: string;
};

export async function makeSlackKudo(
  templateName: string,
  messages: (Messages | undefined)[]
) {
  await init({ data });
  const template = await prisma.template
    .findMany({
      where: {
        name: templateName,
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
      context.strokeStyle = s.color ?? "";
      context.lineCap = "round";
      console.log(s.color);

      context.lineWidth = (s.thickness ?? 50) + 5;
      context.beginPath();
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
          //andere url: "https://raw.githubusercontent.com/EmojiTwo/emojitwo/master/+ d.unified +/0023.png"
        })
        .catch((e) => console.log(e));
      img.onload = () => {
        context.drawImage(
          img,
          (s.x ?? 0) + 750 - ((s.fontSize ?? 200) * (s.scale?.x ?? 1)) / 2,
          (s.y ?? 0) + 500 - ((s.fontSize ?? 200) * (s.scale?.x ?? 1)) / 2,
          (s.fontSize ?? 200) * (s.scale?.x ?? 1),
          (s.fontSize ?? 200) * (s.scale?.y ?? 1)
        );
      };
    } else {
      let text = [s.text];
      messages?.forEach((m) => {
        if (m && m.id === s.id) {
          text[0] = m.text;
        }
      });

      s.fill ? (context.fillStyle = s.fill) : "";
      context.font =
        ((s.fontSize ?? 90) * (s.scale?.y ?? 1)).toString() +
        "px " +
        (s.fontFamily ?? "Arial").toString();
      let textWidth = context.measureText(text[0] ?? "fout").width;

      while (textWidth > width) {
        const array: string[] = [];
        text.map((t) => {
          const splitsing = t?.split(" ");
          const lengte = splitsing?.length ?? 0;
          const string1 = splitsing?.filter((t, i) => i < lengte / 2).join(" ");
          const string2 = splitsing
            ?.filter((t, i) => i >= lengte / 2)
            .join(" ");
          array.push(string1 ?? "");
          array.push(string2 ?? "");
        });
        text = array;
        const widthArray: number[] = text.map(
          (t) => context.measureText(t ?? "fout").width
        );
        textWidth = Math.min(...widthArray);
      }

      text.forEach((t, i) => {
        context.fillText(
          t ?? "fout",
          (s.x ?? 0) + 750 - textWidth / 2,
          (s.y ?? 0) + 500 + (s.fontSize ?? 0) / 3 + (s.fontSize ?? 0) * i
        );
      });
    }
  });
  await delay(2000);
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
export async function getChosenTemplate(name: string) {
  return await prisma.template.findFirst({
    where: {
      name: name,
    },
  });
}
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
