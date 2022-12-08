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
import {useNavigate} from 'react-router-dom'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {signup} from '../fetchers'

const SignupSchema = Yup.object().shape({
  username: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  passwordConfirm: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match',
  ),
})

export function SignUpPage() {
  const navigate = useNavigate()
  const mutation = useMutation(signup, {
    onSuccess: (res) => {
      // onCreated()
      console.log(res)
      navigate('/signin')
    },
    onError(error, variables, context) {
      //@ts-ignore
      alert(error?.response?.data?.error)
    },
  })
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2))
      mutation.mutate(values)
    },
  })

  return (
    <Center>
      <form onSubmit={formik.handleSubmit}>
        <Box border="1px solid #ddd" p={8} mt={10}>
          {/* <Box>New Project</Box> */}
          <Heading as="h2" size="md" mb={6}>
            Sign up
          </Heading>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              type="text"
              autoFocus
              id="username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.errors.username ? <div>{formik.errors.username}</div> : null}
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              id="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.errors.email ? <div>{formik.errors.email}</div> : null}
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              id="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.errors.password ? <div>{formik.errors.password}</div> : null}
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <FormControl>
            <FormLabel>Password Confirm</FormLabel>
            <Input
              name="passwordConfirm"
              type="password"
              id="passwordConfirm"
              onChange={formik.handleChange}
              value={formik.values.passwordConfirm}
            />
            {formik.errors.passwordConfirm ? (
              <div>{formik.errors.passwordConfirm}</div>
            ) : null}
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>

          <Flex justifyContent="space-between" minW="380px">
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={mutation.isLoading}
              type="submit"
            >
              Sign up
            </Button>

            <Button mt={4} type="button" onClick={() => navigate('/signin')}>
              Cancel
            </Button>
          </Flex>
        </Box>
      </form>
    </Center>
  )
}
