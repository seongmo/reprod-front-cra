import {useAuth} from './useAuth'
import jwt_decode from 'jwt-decode'

export type Profile = {
  id: string
  email: string
  name: string
}
export function useProfile() {
  const {user} = useAuth()
  const profile = jwt_decode(user?.token || '') as Profile
  return profile
}
