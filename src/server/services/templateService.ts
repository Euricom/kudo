import { type Template } from "@prisma/client";
import { prisma } from "~/server/db";




export const findAllTemplates = async (): Promise<Template[]> => {
    const temps = await prisma.template.findMany({});
    return temps;
};

export const findTemplateById = async (id: string): Promise<Template> => {
    const temp = (await prisma.template.findUnique({
        where: {
            id: id
        }
    })) as Template;
    return temp;
};
