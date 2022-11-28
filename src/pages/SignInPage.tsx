import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from '@chakra-ui/react'
import {useMutation} from '@tanstack/react-query'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {postLogin} from '../fetchers'
import {useAuth} from '../hooks/useAuth'

// TODO: Formik validation

export function SignInPage() {
  const navigate = useNavigate()
  const {login} = useAuth()
  const [hasError, setHasError] = useState(false)
  console.log({login})
  const mutation = useMutation(postLogin, {
    onSuccess: (res) => {
      // onCreated()
      console.log('onSuccess', res)
      login({token: res.data.token})
    },
    onError(error, variables, context) {
      console.log('onError', error)
      setHasError(true)
    },
  })

  return (
    <Center>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          //@ts-ignore
          const email = e.currentTarget.querySelector('[name=email]').value
          //@ts-ignore
          const password = e.currentTarget.querySelector('[name=password]').value
          //@ts-ignore
          mutation.mutate({email, password})
        }}
      >
        <Box border="1px solid #ddd" p={8} mt={10}>
          {/* <Box>New Project</Box> */}
          <Heading as="h2" size="md" mb={6}>
            Sign in
          </Heading>
          {/* <FormControl>
            <FormLabel>Username</FormLabel>
            <Input name="username" type="text" autoFocus />
          </FormControl> */}
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <Box>{hasError && <Box>Invalid username or password</Box>}</Box>

          <Flex justifyContent="space-between" minW="380px">
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={mutation.isLoading}
              type="submit"
            >
              Sign in
            </Button>

            <Button mt={4} type="button" onClick={() => navigate('/signup')}>
              Sign up
            </Button>
          </Flex>
          <Box mt={4}>
            <Box>
              <Link to="/find-username">Forgot username?</Link>
            </Box>
            <Box>
              <Link to="/find-password">Forgot password?</Link>
            </Box>
          </Box>
        </Box>
      </form>
    </Center>
  )
}
