import {map} from "lodash";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient({
    log: ['query'],
});

const getBuildings = async (propertyCode: string) => {
    const result = await prisma.property.findMany({
        where: {
            propertyCode: propertyCode,
        },

        include: {
            freeTable3: { //todo: rename connection table in schema
                select: {
                    buildings: true,
                },
            },
            freeTable2: { //todo: rename connection table in schema
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

    return map(result[0].freeTable3?.buildings, (building) => {
        return {
            ...building,
            ...result[0].freeTable2,
        }
    })
}

const getBuilding = async (buildingId: string) => {
    return prisma.building.findUnique({
        where: {
            buildingId: buildingId,
        },
        include: {
            buildingType: true,
            property: true,
            buildings: true,
            area: true,
        }
    })
};


export {getBuildings, getBuilding}