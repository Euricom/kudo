import { type Kudo } from "@prisma/client";
import { prisma } from "../db";

type Image = {
    id: string
    dataUrl: string
}

export const createKudo = async (dataUrl: string): Promise<Kudo> => {
    const image: Image = await createKudoImage(dataUrl)
    const kudo = (await prisma.kudo.create({
      data: {
        image: image.id,
        liked: false,
        comment: ''
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