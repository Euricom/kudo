import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export interface templateProps {
    Title: string;
    Color: string;
    Sticker: string;
}

async function main() {
    const temp1 = await prisma.template.create({
        data: {
            Title: 'Well done',
            Color: '00ff00',
            Sticker: "Smile",
        }
    })

    const temp2 = await prisma.template.upsert({
        where: {},
        update: {},
        create: {
            Title: 'Good job',
            Color: 'FF0000',
            Sticker: "Heart",
        },
    })
    console.log({ temp1, temp2 })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })