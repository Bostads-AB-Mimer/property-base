import KoaRouter from '@koa/router'
import { routes as componentsRoutes } from './routes/components'
import { routes as residencesRoutes } from './routes/residences'
import { routes as buildingsRoutes } from './routes/buildings'
import { routes as propertiesRoutes } from './routes/properties'
import { routes as staircasesRoutes } from './routes/staircases'
import { routes as roomsRoutes } from './routes/rooms'
import { routes as companiesRoutes } from './routes/companies'

const router = new KoaRouter()

componentsRoutes(router)
residencesRoutes(router)
buildingsRoutes(router)
propertiesRoutes(router)
staircasesRoutes(router)
roomsRoutes(router)
companiesRoutes(router)

export default router
