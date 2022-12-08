import {Navigate, Route} from 'react-router-dom'
import {Root} from '../../components/Root'
import {DashboardRoutes} from './dashboard/Dashboard'
import {NewJupyterLab} from './new-projects/NewProjectPage'
import ErrorPage from '../ErrorPage'

export const JlabRoutes = (
  <Route path="/jlab" errorElement={<ErrorPage />} element={<Root />}>
    <Route index element={<Navigate to="dashboard" />} />
    {DashboardRoutes}
    <Route path="labs/new" element={<NewJupyterLab />} />
  </Route>
)
