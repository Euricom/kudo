import { type Kudo } from "@prisma/client";
import { prisma } from "../db";

type Image = {
  id: string
  dataUrl: string
}

export const createKudo = async (dataUrl: string, sessionId: string, userId: string): Promise<Kudo> => {

  const image: Image = await createKudoImage(dataUrl)
  const kudo = (await prisma.kudo.create({
    data: {
      image: image.id,
      liked: false,
      comment: '',
      sessionId: sessionId,
      userId: userId,
    },
  }));
  return kudo;
}

export const createKudoImage = async (dataUrl: string): Promise<Image> => {
  const image: Image = (await prisma.image.create({
    data: {
      dataUrl: dataUrl,
    },
  })) as Image;
  return image;
}