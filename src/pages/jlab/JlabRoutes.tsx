import {Navigate, Route} from 'react-router-dom'
import {Root} from '../../components/Root'
import {DashboardRoutes} from './dashboard/Dashboard'
import {NewProject} from './new-projects/NewProjectPage'
import ErrorPage from '../ErrorPage'
import {ProjectRoutes} from '../ProjectDetails'

export const JlabRoutes = (
  <Route path="/jlab" errorElement={<ErrorPage />} element={<Root />}>
    <Route index element={<Navigate to="dashboard" />} />
    {DashboardRoutes}
    {ProjectRoutes}
    <Route path="projects/new" element={<NewProject />} />
    {/* <Route path="new" element={<NewProject />} /> */}
  </Route>
)
