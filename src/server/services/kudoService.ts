import { prisma } from "../db";

type image = {
    id: string
    dataUrl: string
}

export const createKudo = async (dataUrl: string) => {
    const image: image = await prisma.create({
        data: {
          dataUrl: dataUrl,
        },
      })
    return image;
}