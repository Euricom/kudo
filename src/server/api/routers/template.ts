import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { array, nativeEnum, number, object, oboolean, onumber, optional, ostring, string } from "zod";
import { type Template } from "@prisma/client";
import { CanvasShapes } from "~/types";

const Vector2d = object({
    x: number(),
    y: number(),
});
const jsonbSchema = object({
    type: nativeEnum(CanvasShapes),
    id: string(),
    x: onumber(),
    y: onumber(),
    scale: optional(Vector2d),
    width: onumber(),
    height: onumber(),
    fill: ostring(),
    text: ostring(),
    image: ostring(),
    tool: ostring(),
    points: optional(array(number())),
    thickness: onumber(),
    color: ostring(),
    align: ostring(),
    verticalAlign: ostring(),
    fontSize: onumber(),
    draggable: oboolean(),
    rotation: onumber(),
    radius: onumber(),
});
const createTemplateInput = object({
    name: string(),
    color: string(),
    image: string(),
    content: array(jsonbSchema),
})

const inputGetById = object({
    id: string(),
})

export const templateRouter = createTRPCRouter({

    getAllTemplates: protectedProcedure.query(({ ctx }) => {
        const templates = ctx.prisma.template.findMany({})
        return templates
    }),

    getTemplateById: protectedProcedure.input(inputGetById).query(({ input, ctx }) => {
        const template = ctx.prisma.template.findUnique({
            where: {
                id: input.id,
            }
        });
        return template
    }),

    // Create
    createTemplate: protectedProcedure.input(createTemplateInput).mutation(async ({ input, ctx }): Promise<Template> => {

        const template = (await ctx.prisma.template.create({
            data: {
                name: input.name,
                color: input.color,
                image: input.image,
                content: input.content,
            },
        }));
        return template;
    }),
});