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
import {useFormik} from 'formik'
import {Link, useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import {createJptLab, getProjectUniq} from '../../../fetchers'
import './NewProjectPage.css'

const Step1Schema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-z0-9-]+$/, 'Must be lowercase, numbers, or dashes')
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
})

export function NewJupyterLab() {
  const navigate = useNavigate()
  const mutation = useMutation(createJptLab, {
    onSuccess: (res) => {
      navigate(`../dashboard/labs`)
    },
  })

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Step1Schema,
    onSubmit: (values) => {
      console.log({values})
      mutation.mutate(values)
    },
  })

  return (
    <Center>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const res = await getProjectUniq(formik.values.name)
          console.log(res)
          if (res?.isExists) {
            formik.setFieldError('name', 'Already exists')
          } else {
            formik.handleSubmit(e)
          }
        }}
      >
        <Box border="1px solid #ddd" p={8} mt={10}>
          {/* <Box>New Project</Box> */}
          <Heading as="h2" size="md" mb={6}>
            New Lab
          </Heading>
          <FormControl>
            <FormLabel>Lab Name</FormLabel>
            <Input
              name="name"
              type="text"
              autoFocus
              id="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            {formik.errors.name ? <Box color="red.600">{formik.errors.name}</Box> : null}
          </FormControl>

          <Flex justifyContent="space-between" minW="380px">
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={mutation.isLoading}
              type="submit"
            >
              Create JupyterLab
            </Button>
            <Button mt={4} as={Link} to=".." type="button">
              Cancel
            </Button>
          </Flex>
        </Box>
      </form>
    </Center>
  )
}
