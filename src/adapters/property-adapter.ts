import {PrismaClient} from '@prisma/client'
import {map} from "lodash";

const prisma = new PrismaClient({
    log: ['query'],
});

const getPropertyById = async (propertyId: string) => {
    const response = await prisma.property.findUnique({
        where: {
            propertyId: propertyId,
        },
        include: {
            propertyObject: true,
        },
    })
    return response
}

const getProperties = async (tract: string | undefined) => {
    if (tract) {
        return prisma.property.findMany({
            where: {tract},
            select: {
                propertyId: true,
                propertyCode: true,
                tract: true,
                propertyDesignation: true,
            },
        })
    }
    return prisma.property.findMany({
        select: {
            propertyId: true,
            propertyCode: true,
            tract: true,
            propertyDesignation: true,
        },
    })
}

export {getPropertyById, getProperties }
