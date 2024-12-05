import { ResidenceBasicInfo, ResidenceBasicInfoSchema } from '../../types/residence'
import { ResidenceWithBasicInfo } from '../../adapters/residence-adapter'

export function mapDbToResidenceBasicInfo(dbRecord: ResidenceWithBasicInfo): ResidenceBasicInfo {
  if (!dbRecord) return null

  return ResidenceBasicInfoSchema.parse({
    id: dbRecord.id?.trim() || '',
    code: dbRecord.code?.trim() || '',
    name: dbRecord.name?.trim() || '',
    _links: {
      self: {
        href: `/residences/${dbRecord.id?.trim() || ''}`,
      },
    },
  })
}
