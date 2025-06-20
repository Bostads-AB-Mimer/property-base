import KoaRouter from '@koa/router'
import { routes as componentsRoutes } from './routes/components-route'
import { routes as residencesRoutes } from './routes/residences-route'
import { routes as buildingsRoutes } from './routes/buildings-route'
import { routes as propertiesRoutes } from './routes/properties-route'
import { routes as staircasesRoutes } from './routes/staircases-route'
import { routes as roomsRoutes } from './routes/rooms-route'
import { routes as companiesRoutes } from './routes/companies-route'
import { routes as maintenanceUnitsRoutes } from './routes/maintenance-units-route'
import { routes as healthRoutes } from './routes/health-route'

const router = new KoaRouter()

componentsRoutes(router)
residencesRoutes(router)
buildingsRoutes(router)
propertiesRoutes(router)
staircasesRoutes(router)
roomsRoutes(router)
companiesRoutes(router)
maintenanceUnitsRoutes(router)
healthRoutes(router)

export default router
