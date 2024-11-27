import {map} from "lodash"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient({
    log: ['query'],
})

async function getStaircasesByBuildingCode(buildingCode: string) {
    console.log('buildingCode:', buildingCode)
    const building = await prisma.building.findFirst({
        where: {
            buildingCode: {
                contains: buildingCode,
            }
        },
        select: { name: true },
    })

    if (!building) {
        throw new Error(`Building with code ${buildingCode} not found.`)
    }
    console.log('building:', building.name)
    return prisma.staircase.findMany({
        where: { name: building.name },
    })
}

export {getStaircasesByBuildingCode}
