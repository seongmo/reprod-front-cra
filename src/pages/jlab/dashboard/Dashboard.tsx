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
import {Link, Navigate, NavLink, Outlet, Route, useNavigate} from 'react-router-dom'
import {deleteJptLab, getJptLabs, runJptLab, stopJptLab} from '../../../fetchers'
import {useAuth} from '../../../hooks/useAuth'
import {queryClient} from '../../../queryClient'
import {JptLab, ProjectItem} from '../../../types/data'

function LabSummaryCard({lab}: {lab: JptLab}) {
  const navigate = useNavigate()

  const deleteLabMut = useMutation({
    mutationFn: deleteJptLab,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['labs'])
      // navigate(``)
    },
  })
  const runLabMut = useMutation({
    mutationFn: runJptLab,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['labs'])
      // navigate(``)
    },
  })
  const stopLabMut = useMutation({
    mutationFn: stopJptLab,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['labs'])
      // navigate(``)
    },
  })

  const status = lab.jupyterInstance ? 'running' : 'stopped'
  const createdAt = lab.createdAt && new Date(lab.createdAt)

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
      // onClick={() => navigate(`../../labs/${lab.name}`)}
    >
      <Flex mb={3}>
        <Box flex={1} fontWeight="bold" color="#0f70d4">
          {lab.name}
        </Box>
        {/* <Box p={2}>{status === 'inline' ? 'running' : status}</Box> */}
        <Box fontWeight={500} color="#19aa99">
          {status}
        </Box>
      </Flex>

      <Box fontSize="12px">
        created at: {createdAt && format(createdAt, 'yyyy-MM-dd HH:mm:ss')}
      </Box>
      <Box mt={2} textAlign="right">
        <Button
          size="sm"
          colorScheme="blue"
          isLoading={runLabMut.isLoading}
          onClick={(e) => {
            runLabMut.mutate(lab._id)
            // e.stopPropagation()
            // window.confirm('Are you sure?') && deleteLabMut.mutate(lab._id)
          }}
        >
          Run
        </Button>
        {status === 'running' && (
          <Box>
            <Button
              onClick={() => {
                window.open(`/jpt/${lab.name}/lab`, '_blank')
              }}
            >
              Open
            </Button>
            <Button
              onClick={() => {
                stopLabMut.mutate(lab._id)
              }}
            >
              Stop
            </Button>
          </Box>
        )}
        <Button
          size="sm"
          // colorScheme="red"
          isLoading={deleteLabMut.isLoading}
          onClick={(e) => {
            e.stopPropagation()
            window.confirm('Are you sure?') && deleteLabMut.mutate(lab._id)
          }}
        >
          <DeleteIcon />
        </Button>
      </Box>
    </Box>
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

function LabsDashboard() {
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
      <Flex bg="gray.50" alignItems="center" p={2} borderBottom="1px solid #c7c9cc">
        <Box mr={10} color="#0f70d4" fontWeight="bold">
          <Link to="/jlab">Reprod JupyterLab</Link>
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
          <NavLink to="labs">
            {({isActive}) => (
              <DashboardMenuItem title="JupyterLabs" isActive={isActive} />
            )}
          </NavLink>
        </Box>

        <Box flex={1} p={4}>
          <Outlet />
        </Box>
      </Flex>
    </Box>
  )
}

function Labs() {
  const navigate = useNavigate()
  const {isLoading, data, refetch} = useQuery<JptLab[]>(['labs'], getJptLabs)

  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <>
      <Heading as="h4" size="lg">
        Labs
      </Heading>
      <Button onClick={() => refetch()}>Refetch</Button>
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
                onClick={() => navigate(`../../labs/new`)}
              >
                + New JupyterLab
              </Center>
            </WrapItem>
            {data?.map((lab) => (
              <WrapItem key={lab._id}>
                <LabSummaryCard lab={lab} />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </Box>
    </>
  )
}

export const DashboardRoutes = (
  <Route path="dashboard" element={<LabsDashboard />}>
    <Route index element={<Navigate to="labs" />} />
    <Route path="labs" element={<Labs />} />
    {/* <Route path="profile" element={<Profile />} /> */}
  </Route>
)
