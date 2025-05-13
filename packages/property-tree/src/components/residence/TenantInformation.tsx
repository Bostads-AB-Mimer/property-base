import { Separator } from '../ui/v2/separator'
import { LeaseInfo } from './LeaseInfo'
import { TenantCard } from './TenantCard'

type Tenant = any
interface TenantInformationProps {
  tenant: Tenant | Tenant[]
}

export function TenantInformation({ tenant }: TenantInformationProps) {
  const tenants = Array.isArray(tenant) ? tenant : [tenant]
  const primaryTenant = tenants.find((t) => t.isPrimaryTenant) || tenants[0]
  const additionalTenants = tenants.filter((t) => t !== primaryTenant)

  const isSecondaryRental = tenants.some(
    (t) => t.relationshipType === 'secondaryTenant'
  )

  const secondaryTenant = tenants.find(
    (t) => t.relationshipType === 'secondaryTenant'
  )
  const secondaryContractNumber = secondaryTenant?.contractNumber

  return (
    <div className="space-y-6">
      <LeaseInfo
        primaryContractNumber={primaryTenant.contractNumber}
        secondaryContractNumber={secondaryContractNumber}
        isSecondaryRental={isSecondaryRental}
      />

      <div className="space-y-6">
        <TenantCard tenant={primaryTenant} />
        {additionalTenants.length > 0 && (
          <>
            <Separator />
            {additionalTenants.map((additionalTenant, i) => (
              <TenantCard tenant={additionalTenant} key={i} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
