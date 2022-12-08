import {ChevronDownIcon, SearchIcon, StarIcon} from '@chakra-ui/icons'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Tr,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import {useQuery} from '@tanstack/react-query'
import jwt_decode from 'jwt-decode'
import {Link, NavLink, Outlet, Route} from 'react-router-dom'
import {getProjects} from '../../../fetchers'
import {useAuth} from '../../../hooks/useAuth'
import {useProfile} from '../../../hooks/useProfile'
import {ProjectItem} from '../../../types/data'
import {ProjectsPage} from './ProjectsPage'
import {SearchPage} from './SearchPage'

function StaredModel({proj}: {proj: ProjectItem}) {
  return (
    <Box border="1px solid #ddd" p={1} position="relative" minW="280px">
      <Box pos="absolute" top="10px" right="10px">
        <StarIcon color="yellow.300" />
      </Box>

      <Box mt="20px" mb="15px" textAlign="center">
        {proj.name}
      </Box>
      <Flex justifyContent="space-between">
        <Button size="sm" as={Link} to={`../projects/${proj.name}/model_card`}>
          Model Card
        </Button>
        <Button size="sm" as={Link} to={`../projects/${proj.name}`}>
          More Detail
        </Button>
      </Flex>
    </Box>
  )
}

function StaredProjects() {
  const {isLoading, data} = useQuery<ProjectItem[]>(['projects'], getProjects)
  if (isLoading) return <div>loading...</div>
  return (
    <Box pt={4}>
      <Heading as="h5" size="md" mb={2}>
        Star
      </Heading>
      <Wrap mb={4}>
        {data
          ?.filter((p) => p.stared)
          .map((proj) => (
            <WrapItem key={proj._id}>
              <StaredModel proj={proj} />
            </WrapItem>
          ))}
      </Wrap>
    </Box>
  )
}

function DashboardSummary() {
  const profile = useProfile()

  return (
    <>
      <Heading as="h4" size="lg">
        User Information
      </Heading>
      <Box border="1px solid #ddd" borderRadius="10px" p={4}>
        <Flex>
          <Box>
            <Avatar
              size="2xl"
              name={profile.name}
              bg="teal.200"
              m={2}
              // src="https://bit.ly/broken-link"
            />
            <Box textAlign="center">{profile.name}</Box>
          </Box>
          <Box flex={1} ml={18}>
            <Table>
              <Tbody>
                <Tr>
                  <Td>Name</Td>
                  <Td>{profile.name}</Td>
                </Tr>
                <Tr>
                  <Td>E-mail</Td>
                  <Td>{profile.email}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Box>

      <StaredProjects />
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
          <Link to="/automl">Reprod AutoML</Link>
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
              <MenuItem as={Link} to="/jlab">
                JupyterLabs
              </MenuItem>
              <MenuItem as={Link} to="/profile">
                Profile ({profile.name})
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
          <NavLink to="projects">
            {({isActive}) => <DashboardMenuItem title="Projects" isActive={isActive} />}
          </NavLink>
          <NavLink to="search">
            {({isActive}) => <DashboardMenuItem title="Search" isActive={isActive} />}
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

export const DashboardRoutes = (
  <Route path="dashboard" element={<ProjectsDashboard />}>
    <Route index element={<DashboardSummary />} />
    <Route path="projects" element={<ProjectsPage />} />
    <Route path="search" element={<SearchPage />} />
  </Route>
)
