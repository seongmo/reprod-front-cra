import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
} from '@chakra-ui/react'
import {useMutation} from '@tanstack/react-query'
import {useFormik} from 'formik'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'
import {deleteDraft, getProjectUniq, saveDraft, Step1Data} from '../../../fetchers'
import './NewProjectPage.css'

const Step1Schema = Yup.object().shape({
  projectName: Yup.string()
    .matches(/^[a-z0-9-]+$/, 'Must be lowercase, numbers, or dashes')
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
})

export function NewProjectStep1({onCreated}: {onCreated: () => void}) {
  const navigate = useNavigate()
  const mutation = useMutation<unknown, unknown, Step1Data>(saveDraft, {
    onSuccess: (res) => {
      onCreated()
    },
  })
  const deleteMut = useMutation(deleteDraft, {
    onSuccess: (res) => {
      navigate(`../dashboard/projects`)
    },
  })
  const formik = useFormik({
    initialValues: {
      projectName: '',
      task: 'multi-class',
      model: 'kobert',
    },
    validationSchema: Step1Schema,
    onSubmit: (values) => {
      console.log({values})
      const draft = {step: 1, ...values}
      mutation.mutate(draft)
    },
  })

  return (
    <Center>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const res = await getProjectUniq(formik.values.projectName)
          console.log(res)
          if (res?.isExists) {
            formik.setFieldError('projectName', 'Already exists')
          } else {
            formik.handleSubmit(e)
          }
        }}
        //         onSubmit={(e) => {
        //           e.preventDefault()
        //           //@ts-ignore
        //           const projectName = e.currentTarget.querySelector('[name=projectName]').value
        // if(projectName.length < 3) {
        //   e``
        // }

        //           //@ts-ignore
        //           const task = e.currentTarget.querySelector('[name=task]').value
        //           //@ts-ignore
        //           const model = e.currentTarget.querySelector('[name=model]').value

        //           const draft = {step: 1, projectName, task, model}
        //           mutation.mutate(draft as any)
        //         }}
      >
        <Box border="1px solid #ddd" p={8} mt={10}>
          {/* <Box>New Project</Box> */}
          <Heading as="h2" size="md" mb={6}>
            New Project
          </Heading>
          <FormControl>
            <FormLabel>Project Name</FormLabel>
            <Input
              name="projectName"
              type="text"
              autoFocus
              id="projectName"
              onChange={formik.handleChange}
              value={formik.values.projectName}
            />
            {formik.errors.projectName ? (
              <Box color="red.600">{formik.errors.projectName}</Box>
            ) : null}
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <FormControl>
            <FormLabel>Task</FormLabel>
            <Select name="task" onChange={formik.handleChange} value={formik.values.task}>
              <option disabled value="binary">
                Text Classification (binary)
              </option>
              <option value="multi-class">Text Classification (Multi-class)</option>
              <option disabled>Text Classification (Multilabel)</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Model Choice</FormLabel>
            <Select
              name="model"
              onChange={formik.handleChange}
              value={formik.values.model}
            >
              <option value="kobert">KoBERT</option>
              <option value="kogpt2">KoGPT</option>
              <option disabled>KoBART</option>
              <option disabled>+New Model</option>
            </Select>
          </FormControl>
          <Flex justifyContent="space-between" minW="380px">
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={mutation.isLoading}
              type="submit"
            >
              Create project
            </Button>
            <Button
              mt={4}
              // colorScheme='teal'
              // isLoading={props.isSubmitting}
              type="button"
              onClick={() => deleteMut.mutate()}
            >
              Cancel
            </Button>
            {/* <Button
              mt={4}
              type="button"
            >
              Manual
            </Button> */}
          </Flex>
        </Box>
      </form>
    </Center>
  )
}
