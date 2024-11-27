import {map} from "lodash"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient({
    log: ['query'],
})

const getBuildings = async (propertyCode: string) => {
    const result = await prisma.property.findMany({
        where: {
            code: propertyCode,
        },

        include: {
            propertyDesignation: {
                select: {
                    buildings: true,
                },
            },
            district: {
                select: {
                    code: true,
                    caption: true,
                },
            },
        },
    })

    if (!result[0]) {
        return []
    }

    return map(result[0].propertyDesignation?.buildings, (building) => {
        return {
            ...building,
            ...result[0].district,
        }
    })
}

const getBuildingByCode = async (buildingCode: string) => {
    return prisma.building.findFirst({
        where: {
            buildingCode: {
                contains: buildingCode,
            }
        },
        include: {
            buildingType: true,
            marketArea: true,
            propertyDesignation: true,
            district: true,
        }
    })
}

async function getBuildingStaircases(buildingCode: string) {
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

    return prisma.staircase.findMany({
        where: { name: building.name },
    })
}


export {getBuildings, getBuildingByCode, getBuildingStaircases}
