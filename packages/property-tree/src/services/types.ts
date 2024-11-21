export interface Issue {
  id: string
  date: string
  description: string
  status: 'resolved' | 'pending' | 'in-progress'
  priority: 'low' | 'medium' | 'high'
  category: 'maintenance' | 'repair' | 'replacement'
  feature: string
  room: string
}

export interface Component {
  id: string
  name: string
  type: 'appliance' | 'fixture' | 'furniture' | 'other'
  category: string
  installationDate: string
  warranty?: string
  manufacturer?: string
  model?: string
  serialNumber?: string
  lastService?: string
  nextService?: string
  status: 'operational' | 'needs-service' | 'broken'
  room: string
  issues: Issue[]
}

export interface Room {
  id: string
  name: string
  type: 'bedroom' | 'kitchen' | 'bathroom' | 'living' | 'other'
  size: number
  windows: number
  features: string[]
}

export interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  moveInDate: string
  apartmentId: string
}

export interface Apartment {
  id: string
  name: string
  address: string
  size: number
  bedrooms: number
  rent: number
  tenant: Tenant
  entranceId: string
  rooms: Room[]
  activeIssues: Issue[]
  components: Component[]
}

export interface Entrance {
  id: string
  name: string
  buildingId: string
  apartments: string[]
  totalApartments: number
  occupiedApartments: number
}

export interface Building {
  id: string
  name: string
  propertyId: string
  entrances: string[]
  totalApartments: number
  occupiedApartments: number
}

export interface Property {
  id: string
  name: string
  address: string
  areaId: string
  buildings: string[]
  totalApartments: number
  occupiedApartments: number
  constructionYear: number
  lastRenovation?: number
}

export interface Area {
  id: string
  name: string
  properties: string[]
  totalApartments: number
  occupiedApartments: number
  totalProperties: number
}

export interface NavigationItem {
  id: string
  name: string
  type: 'area' | 'property' | 'building' | 'entrance' | 'apartment' | 'tenant'
  children?: NavigationItem[]
  metadata?: {
    apartmentId?: string
    email?: string
    phone?: string
  }
}
