import {map} from "lodash"
import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient({
    log: ['query'],
})

async function getStaircasesByBuildingCode(buildingCode: string) {
    const propertyStructures = await prisma.propertyStructure.findMany({
        where: {
            buildingCode: {
                contains: buildingCode,
            },
            NOT: {
                floorId: null,
            },
            residenceId: null,
            localeId: null
        }
    })

    return  prisma.staircase.findMany({
            where: {
                objectID: {
                    in: map(propertyStructures, 'objectId')
                }
            }
        })
}

export {getStaircasesByBuildingCode}
