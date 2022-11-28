import {createContext, useCallback, useContext, useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {useState} from 'react'

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName)
      if (value) {
        const data = JSON.parse(value)
        // axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        return data
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue))
        return defaultValue
      }
    } catch (err) {
      return defaultValue
    }
  })
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue))
      // axios.defaults.headers.common['Authorization'] = `Bearer ${newValue.token}`
    } catch (err) {}
    setStoredValue(newValue)
  }
  return [storedValue, setValue]
}

type Auth = {
  user: any
  login: (user: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<Auth>({
  user: null,
  login: async () => {},
  logout: () => {},
})

export const AuthProvider = ({children}) => {
  const [user, setUser] = useLocalStorage('user', null)
  const navigate = useNavigate()

  // call this function when you want to authenticate the user
  const login = useCallback(
    async (data) => {
      setUser(data)

      console.log('login')
      navigate('/')
      // console.log('naviagate')
    },
    [setUser, navigate],
  )

  // call this function to sign out logged in user
  const logout = useCallback(() => {
    setUser(null)

    // console.log('logout')
    navigate('/signin', {replace: true})
  }, [setUser, navigate])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout],
  )
  // console.log({value})
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
