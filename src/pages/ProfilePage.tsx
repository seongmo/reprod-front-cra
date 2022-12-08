import {ChevronDownIcon} from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react'
import jwt_decode from 'jwt-decode'
import {Link, NavLink} from 'react-router-dom'
import {useAuth} from '../hooks/useAuth'

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

export function ProfilePage() {
  const {logout, user} = useAuth()
  const profile = jwt_decode(user?.token || '') as any
  return (
    <Box>
      <Flex bg="gray.100" alignItems="center" p={2} borderBottom="1px solid #c7c9cc">
        <Box mr={10} color="#0f70d4" fontWeight="bold">
          <Link to="/automl">Reprod</Link>
        </Box>

        <Flex flex={1} justifyContent="flex-end" alignItems="center">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {profile.name}
            </MenuButton>
            <MenuList>
              <MenuItem as={Link} to="/automl">
                AutoML
              </MenuItem>
              <MenuItem as={Link} to="/jlab">
                JupyterLabs
              </MenuItem>
              <MenuItem>Profile ({profile.name})</MenuItem>
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
          <NavLink to="/profile">
            {({isActive}) => <DashboardMenuItem title="Profile" isActive={isActive} />}
          </NavLink>
        </Box>

        <Box flex={1} p={4}>
          <Box>
            <Heading as="h4" size="lg">
              Profile
            </Heading>
            <Box pt={4}>
              <Box>Email: {profile.email}</Box>
              <Box>Name: {profile.name}</Box>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
