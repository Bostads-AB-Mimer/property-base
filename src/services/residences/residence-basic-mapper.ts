import { ResidenceBasicInfo, ResidenceBasicInfoSchema } from '../../types/residence'
import { ResidenceWithBasicInfo } from '../../adapters/residence-adapter'

export function mapDbToResidenceBasicInfo(dbRecord: ResidenceWithBasicInfo): ResidenceBasicInfo {
  if (!dbRecord) return null

  return ResidenceBasicInfoSchema.parse({
    id: dbRecord.id || '',
    code: dbRecord.code || '',
    name: dbRecord.name || '',
    _links: {
      self: {
        href: `/residences/${dbRecord.id?.trim() || ''}`,
      },
      details: {
        href: `/residences/${dbRecord.id?.trim() || ''}/details`,
      },
    },
  })
}
