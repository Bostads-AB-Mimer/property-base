import { ResidenceSchema } from '../../types/residence'
import { toBoolean } from '../../utils/data-conversion'

export function mapDbToResidence(dbRecord: any) {
  if (!dbRecord) return null

  return ResidenceSchema.parse({
    id: dbRecord.id,
    code: dbRecord.code,
    name: dbRecord.name,
    accessibility: {
      wheelchairAccessible: toBoolean(dbRecord.wheelchairAccessible),
      residenceAdapted: toBoolean(dbRecord.residenceAdapted),
      elevator: toBoolean(dbRecord.elevator),
    },
    features: {
      balcony1: dbRecord.balcony1Location
        ? {
            location: dbRecord.balcony1Location,
            type: dbRecord.balcony1Type || '',
          }
        : undefined,
      balcony2: dbRecord.balcony2Location
        ? {
            location: dbRecord.balcony2Location,
            type: dbRecord.balcony2Type || '',
          }
        : undefined,
      patioLocation: dbRecord.patioLocation,
      hygieneFacility: dbRecord.hygieneFacility || '',
      sauna: toBoolean(dbRecord.sauna),
      extraToilet: toBoolean(dbRecord.extraToilet),
      sharedKitchen: toBoolean(dbRecord.sharedKitchen),
      petAllergyFree: toBoolean(dbRecord.petAllergyFree),
      electricAllergyIntolerance: toBoolean(
        dbRecord.electricAllergyIntolerance
      ),
      smokeFree: toBoolean(dbRecord.smokeFree),
      asbestos: toBoolean(dbRecord.asbestos),
    },
    entrance: dbRecord.entrance || '',
    partNo: dbRecord.partNo,
    part: dbRecord.part,
    deleted: toBoolean(dbRecord.deleteMark),
    validityPeriod: {
      fromDate: new Date(dbRecord.fromDate),
      toDate: new Date(dbRecord.toDate),
    },
    residenceType: {
      code: dbRecord.residenceTypeId || '',
      residenceTypeId: dbRecord.residenceTypeId || '',
      checklistId: dbRecord.checklistId,
      name: dbRecord.name,
      timestamp: dbRecord.timestamp,
      roomCount: dbRecord.roomCount,
      kitchen: dbRecord.kitchen || 0,
      systemStandard: dbRecord.systemStandard || 0,
      componentTypeActionId: dbRecord.componentTypeActionId,
      statisticsGroupSCBId: dbRecord.statisticsGroupSCBId,
      statisticsGroup2Id: dbRecord.statisticsGroup2Id,
      statisticsGroup3Id: dbRecord.statisticsGroup3Id,
      statisticsGroup4Id: dbRecord.statisticsGroup4Id,
    },
    propertyObject: {
      energy: {
        energyClass: dbRecord.energyClass || 0,
      },
    },
    _links: {
      self: {
        href: `/residences/${dbRecord.id}`,
      },
      details: {
        href: `/residences/${dbRecord.id}/details`,
      },
      building: {
        href: `/buildings/${dbRecord.buildingCode || ''}`,
      },
      property: {
        href: `/properties/${dbRecord.propertyCode || ''}`,
      },
      rooms: {
        href: `/rooms?residenceCode=${dbRecord.code || ''}`,
      },
    },
  })
}
