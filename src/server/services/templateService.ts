import { prisma } from "~/server/db";
import { type Temp } from "~/types";




export const findAllTemplates = async (): Promise<Temp[]> => {
    const temps: Temp[] = (await prisma.template.findMany({})) as Temp[];
    return temps;
};

export const findTemplateById = async (id: string): Promise<Temp> => {
    const temp: Temp = (await prisma.template.findUnique({
        where: {
            id: id
        }
    })) as Temp;
    return temp;
};
