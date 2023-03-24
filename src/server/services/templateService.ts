import { prisma } from "~/server/db";
import { type temp } from "~/types";




export const findAllTemplates = async (): Promise<temp[]> => {
    const temps: temp[] = (await prisma.template.findMany({})) as temp[];
    return temps;
};

export const findTemplateById = async (id: string): Promise<temp> => {
    const temp: temp = (await prisma.template.findUnique({
        where: {
            id: id
        }
    })) as temp;
    return temp;
};
