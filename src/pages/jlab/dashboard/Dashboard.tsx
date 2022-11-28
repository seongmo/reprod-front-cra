import {ChevronDownIcon, DeleteIcon, SearchIcon} from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import {useMutation, useQuery} from '@tanstack/react-query'
import {format} from 'date-fns'
import jwt_decode from 'jwt-decode'
import {Link, NavLink, Outlet, Route, useNavigate} from 'react-router-dom'
import {deleteProject, getProjects} from '../../../fetchers'
import {useAuth} from '../../../hooks/useAuth'
import {queryClient} from '../../../queryClient'
import {ProjectItem} from '../../../types/data'

function ProjectSummaryCard({proj}: {proj: ProjectItem}) {
  const navigate = useNavigate()

  const deleteProjMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['projects'])
      // navigate(``)
    },
  })

  const status = proj.status
  const createdAt = proj.createdAt && new Date(proj.createdAt)

  return (
    <Box
      bg="#e9eef6"
      w="280px"
      h="180px"
      _hover={{bg: '#e7f0ff'}}
      borderRadius={5}
      cursor="pointer"
      border="1px solid #dfdfdf"
      p={5}
      onClick={() => navigate(`../../projects/${proj.name}`)}
    >
      <Flex mb={3}>
        <Box flex={1} fontWeight="bold" color="#0f70d4">
          {proj.name}
        </Box>
        {/* <Box p={2}>{status === 'inline' ? 'running' : status}</Box> */}
        <Box fontWeight={500} color="#19aa99">
          {status}
        </Box>
      </Flex>
      <Box>Model: {proj.config.model}</Box>
      <Box>Datafile: {proj.config.datafile.replace(proj.name + '/', '')}</Box>
      {/* <Box>{JSON.stringify(args)}</Box> */}
      <Box fontSize="12px">
        created at: {createdAt && format(createdAt, 'yyyy-MM-dd HH:mm:ss')}
      </Box>
      <Box mt={2} textAlign="right">
        <Button
          size="sm"
          // colorScheme="red"
          isLoading={deleteProjMut.isLoading}
          onClick={(e) => {
            e.stopPropagation()
            window.confirm('Are you sure?') && deleteProjMut.mutate(proj._id)
          }}
        >
          <DeleteIcon />
        </Button>
      </Box>
    </Box>
  )
}

function useGetModels() {
  const models = [
    {
      key: 'model1',
      name: 'test model 1',
      url: '',
    },
    {
      key: 'model2',
      name: 'test model 2',
      url: '',
    },
    {
      key: 'model3',
      name: 'test model 3',
      url: '',
    },
    {
      key: 'model4',
      name: 'some model name',
      url: '',
    },
  ]
  return models
}
function useGetDatasets() {
  const datasets = [
    {
      key: 'dataset1',
      name: 'dataset 1',
      url: '',
    },
    {
      key: 'dataset2',
      name: 'dataset 2',
      url: '',
    },
  ]
  return datasets
}

function DashboardSummary() {
  const models = useGetModels()
  const datasets = useGetDatasets()

  return (
    <>
      <Heading as="h4" size="lg">
        Users's Activey
      </Heading>
      <Box pt={4}>
        <Heading as="h5" size="md" mb={2}>
          Models
        </Heading>
        <Wrap mb={4}>
          {models.map((model) => (
            <WrapItem key={model.key}>
              <Box border="1px solid #ddd" p={2}>
                {model.name}
              </Box>
            </WrapItem>
          ))}
        </Wrap>
        <Heading as="h5" size="md" mb={2}>
          Datasets
        </Heading>
        <Wrap mb={4}>
          {datasets.map((ds) => (
            <WrapItem key={ds.key}>
              <Box border="1px solid #ddd" p={2}>
                {ds.name}
              </Box>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </>
  )
}

function DashboardMenuItem({title, isActive}: {title: string; isActive: boolean}) {
  return (
    <Box borderBottom="1px solid #ccc" py={0}>
      <Box
        py={3}
        bg={isActive ? 'white' : '#f2f2f2'}
        borderLeft="5px solid transparent"
        color={isActive ? '#0f70d4' : undefined}
        borderColor={isActive ? '#0f70d4' : undefined}
        _hover={{borderColor: '#0f70d4'}}
        px={2}
      >
        {title}
      </Box>
    </Box>
  )
}

function ProjectsDashboard() {
  // const navigate = useNavigate()
  const {logout, user} = useAuth()
  // const {isLoading, data} = useQuery<ProjectItem[]>(['projects'], getProjects, {
  //   refetchInterval: 1000,
  // })

  // if (isLoading) {
  //   return <Box>Loading</Box>
  // }

  const profile = jwt_decode(user?.token || '') as any

  return (
    <Box>
      <Flex bg="gray.100" alignItems="center" p={2} borderBottom="1px solid #c7c9cc">
        <Box mr={10} color="#0f70d4" fontWeight="bold">
          <Link to="/automl">Reprod</Link>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            {/* <InputLeftElement pointerEvents="none" children={<Icon as={FaFolder} />} /> */}

            <Input bg="white" type="tel" placeholder="Start searching to select fields" />
          </InputGroup>
        </Box>
        <Flex flex={1} justifyContent="flex-end" alignItems="center">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {profile.name}
            </MenuButton>
            <MenuList>
              {/* <MenuItem onClick={() => navigate('/jlab')}>JupyterLabs</MenuItem> */}
              <MenuItem as={Link} to="/automl">
                AutoML
              </MenuItem>
              <MenuItem onClick={() => logout()} fontWeight="bold">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Flex>
        <Box
          borderRight="1px solid #ddd"
          bg="#f1f1f1"
          h="calc(100vh - 57px)"
          minW="180px"
        >
          <NavLink to="" end>
            {({isActive}) => <DashboardMenuItem title="Dashboard" isActive={isActive} />}
          </NavLink>
          <NavLink to="profile">
            {({isActive}) => <DashboardMenuItem title="Profile" isActive={isActive} />}
          </NavLink>
          <NavLink to="projects">
            {({isActive}) => <DashboardMenuItem title="Projects" isActive={isActive} />}
          </NavLink>
        </Box>

        <Box
          //  borderTop="1px solid #ddd"
          flex={1}
          p={4}
        >
          <Outlet />
        </Box>
      </Flex>
    </Box>
  )
}

function Projects() {
  const navigate = useNavigate()
  const {isLoading, data} = useQuery<ProjectItem[]>(['projects'], getProjects)

  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <>
      <Heading as="h4" size="lg">
        Projects
      </Heading>
      <Box pt={4}>
        <Box>
          <Wrap spacing="16px">
            <WrapItem>
              <Center
                bg="#eee"
                w="280px"
                h="180px"
                borderRadius={5}
                cursor="pointer"
                border="1px solid #dfdfdf"
                _hover={{bg: '#f0f0d0'}}
                onClick={() => navigate(`../../projects/new`)}
              >
                + New Project
              </Center>
            </WrapItem>
            {data?.map((proj) => (
              <WrapItem key={proj._id}>
                <ProjectSummaryCard proj={proj} />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </Box>
    </>
  )
}

function Profile() {
  const {user} = useAuth()
  const profile = jwt_decode(user?.token || '') as any
  return (
    <Box>
      <Heading as="h4" size="lg">
        Profile
      </Heading>
      <Box pt={4}>
        <Box>Email: {profile.email}</Box>
        <Box>Name: {profile.name}</Box>
      </Box>
    </Box>
  )
}

export const DashboardRoutes = (
  <Route path="dashboard" element={<ProjectsDashboard />}>
    <Route index element={<DashboardSummary />} />
    <Route path="projects" element={<Projects />} />
    <Route path="profile" element={<Profile />} />
  </Route>
)
