import { ResidenceWithRelations } from '../../adapters/residence-adapter'
import { ResidenceSchema, Residence } from '../../types/residence'
import { toBoolean, trimString } from '../../utils/data-conversion'

export function mapDbToResidence(dbRecord: ResidenceWithRelations): Residence | null {
  if (!dbRecord) return null
  const residence = ResidenceSchema.parse({
    id: trimString(dbRecord.id) || '',
    code: trimString(dbRecord.code) || '',
    name: trimString(dbRecord.name) || '',
    accessibility: {
      wheelchairAccessible: toBoolean(dbRecord.wheelchairAccessible),
      residenceAdapted: toBoolean(dbRecord.residenceAdapted),
      elevator: toBoolean(dbRecord.elevator),
    },
    _links: {
      self: {
        href: `/residences/${dbRecord.id}`,
      },
      details: {
        href: `/residences/${dbRecord.id}/details`,
      },
      building: {
        href: `/buildings/${dbRecord.buildingCode}`,
      },
      property: {
        href: `/properties/${dbRecord.propertyCode}`,
      },
      rooms: {
        href: `/rooms?residenceCode=${dbRecord.code}`,
      }
    },
    location: dbRecord.location || undefined,
    features: {
      balcony1: {
        location: dbRecord.balcony1Location,
        type: dbRecord.balcony1Type,
      },
      balcony2: {
        location: dbRecord.balcony2Location,
        type: dbRecord.balcony2Type,
      },
      patioLocation: dbRecord.patioLocation,
      hygieneFacility: dbRecord.hygieneFacility,
      sauna: Boolean(dbRecord.sauna),
      extraToilet: Boolean(dbRecord.extraToilet),
      sharedKitchen: Boolean(dbRecord.sharedKitchen),
      petAllergyFree: Boolean(dbRecord.petAllergyFree),
      electricAllergyIntolerance: Boolean(dbRecord.electricAllergyIntolerance),
      smokeFree: Boolean(dbRecord.smokeFree),
      asbestos: Boolean(dbRecord.asbestos),
    },
    entrance: dbRecord.entrance,
    partNo: dbRecord.partNo || 0,
    part: dbRecord.part || '',
    deleted: dbRecord.deleted === 1,
    validityPeriod: {
      fromDate: new Date(dbRecord.fromDate),
      toDate: new Date(dbRecord.toDate),
    },
    residenceType: {
      code: dbRecord.residenceType.code,
      name: dbRecord.residenceType.name?.trim() || '',
      roomCount: dbRecord.residenceType.roomCount,
      kitchen: dbRecord.residenceType.kitchen,
      systemStandard: dbRecord.residenceType.systemStandard || 0,
      residenceTypeId: dbRecord.residenceType.id,
      checklistId: dbRecord.residenceType.checklistId,
      componentTypeActionId: dbRecord.residenceType.componentTypeActionId,
      statisticsGroupSCBId: dbRecord.residenceType.statisticsGroupSCBId,
      statisticsGroup2Id: dbRecord.residenceType.statisticsGroup2Id,
      statisticsGroup3Id: dbRecord.residenceType.statisticsGroup3Id,
      statisticsGroup4Id: dbRecord.residenceType.statisticsGroup4Id,
      timestamp: dbRecord.residenceType.timestamp,
    },
    propertyObject: {
      energy: {
        energyClass: dbRecord.propertyObject.energyClass,
        heatingNature: dbRecord.propertyObject.heatingNature,
        // .. add more fields when needed
      },
    },
    _links: {
      self: {
        href: `/residences/${dbRecord.id.trim()}`,
      },
      building: {
        href: `/buildings/byCode/${dbRecord.propertyObject?.building?.buildingCode || ''}`,
      },
      property: {
        href: `/properties/${dbRecord.propertyObject?.property?.code || ''}`,
      }
    },
    links: {
      building: dbRecord.propertyObject?.building?.buildingCode || null,
      property: dbRecord.propertyObject?.property?.code || null
    }
  })
}
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
      balcony1: dbRecord.balcony1Location ? {
        location: dbRecord.balcony1Location,
        type: dbRecord.balcony1Type || '',
      } : undefined,
      balcony2: dbRecord.balcony2Location ? {
        location: dbRecord.balcony2Location,
        type: dbRecord.balcony2Type || '',
      } : undefined,
      patioLocation: dbRecord.patioLocation,
      hygieneFacility: dbRecord.hygieneFacility || '',
      sauna: toBoolean(dbRecord.sauna),
      extraToilet: toBoolean(dbRecord.extraToilet),
      sharedKitchen: toBoolean(dbRecord.sharedKitchen),
      petAllergyFree: toBoolean(dbRecord.petAllergyFree),
      electricAllergyIntolerance: toBoolean(dbRecord.electricAllergyIntolerance),
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
      }
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
      }
    }
  })
}
