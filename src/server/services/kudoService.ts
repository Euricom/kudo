import { prisma } from "../db";

type Image = {
    id: string
    dataUrl: string
}

type Kudo = {
  id: string
  image: string
  liked: boolean
  comment: string
}

export const createKudo = async (dataUrl: string): Promise<Image> => {
    const image: Image = await createKudoImage(dataUrl)
    const kudo: Kudo = (await prisma.kudo.create({
      data: {
        image: image.id,
        liked: false,
        comment: ''
      },
    })) as Kudo;
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