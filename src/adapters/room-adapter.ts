import {Prisma, PrismaClient} from '@prisma/client'
import {map} from "lodash";

const prisma = new PrismaClient({
    log: ['query'],
})

export const getRooms = async (buildingCode: string, floorCode: string, residenceCode: string) => {
    console.log('buildingCode', buildingCode)
    console.log('floorCode', floorCode)
    console.log('residenceCode', residenceCode)
    const propertyStructures = await prisma.propertyStructure.findMany({
        where: {
            buildingCode: {
                contains: buildingCode,
            },
            floorCode: floorCode,
            residenceCode: residenceCode,
            NOT: {
                floorId: null,
                residenceId: null,
                roomId: null,
            },
            localeId: null
        }
    })

    return prisma.room.findMany({
        where: {
            propertyObjectId: {
                in: map(propertyStructures, 'objectId')
            }
        }
    })
}