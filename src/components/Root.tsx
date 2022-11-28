import {Navigate, Outlet} from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

export function Root() {
  const {user} = useAuth()
  // console.log({user})
  if (!user) {
    return <Navigate to="/signin" />
  }
  return <Outlet />
}
