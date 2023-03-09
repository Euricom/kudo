/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


async function main() {

    await prisma.template.deleteMany()

    await prisma.template.createMany({
        data: [
            {
                Title: 'Good job',
                Color: '#FF0000',
                Sticker: "Heart",
            },
            {
                Title: 'Well done',
                Color: '#00FF00',
                Sticker: "Smile",
            },
            {
                Title: 'Terrific!',
                Color: '#0000FF',
                Sticker: "ThumbsUp",
            },
        ]
    })
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