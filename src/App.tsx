import {ChakraProvider} from '@chakra-ui/react'
import {QueryClientProvider} from '@tanstack/react-query'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {DashboardRoutes} from './pages/automl/dashboard/Dashboard'
import {AuthProvider} from './hooks/useAuth'
import ErrorPage from './pages/ErrorPage'
import {FindPassword} from './pages/FindPassword'
import {NewProject} from './pages/automl/new-projects/NewProjectPage'
import {ProjectRoutes} from './pages/automl/ProjectDetails'
import {SignInPage} from './pages/SignInPage'
import {SignUpPage} from './pages/SignupPage'
import theme from './theme'
import {queryClient} from './queryClient'
import {Root} from './components/Root'
import {JlabRoutes} from './pages/jlab/JlabRoutes'
import {ProfilePage} from './pages/ProfilePage'
import './App.css'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        {/* <RouterProvider router={router}  /> */}
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/automl" errorElement={<ErrorPage />} element={<Root />}>
                <Route index element={<Navigate to="dashboard" />} />
                {DashboardRoutes}
                {ProjectRoutes}
                <Route path="projects/new" element={<NewProject />} />
                {/* <Route path="new" element={<NewProject />} /> */}
              </Route>
              <Route path="/profile" errorElement={<ErrorPage />} element={<Root />}>
                <Route index element={<ProfilePage />} />
              </Route>
              {JlabRoutes}
              <Route path="/" element={<Navigate to="/automl" />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/find-password" element={<FindPassword />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
