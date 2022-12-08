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
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const saveDraft = (draft: void) => axios.post('/draft', draft)

export function FindPassword() {
  const navigate = useNavigate()
  const mutation = useMutation(saveDraft, {
    onSuccess: (res) => {
      // onCreated()
    },
  })

  return (
    <Center>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          //@ts-ignore
          const projectName = e.currentTarget.querySelector('[name=projectName]').value
          //@ts-ignore
          const task = e.currentTarget.querySelector('[name=task]').value
          //@ts-ignore
          const model = e.currentTarget.querySelector('[name=model]').value
          const draft = {step: 1, projectName, task, model}
          mutation.mutate(draft as any)
        }}
      >
        <Box border="1px solid #ddd" p={8} mt={10}>
          {/* <Box>New Project</Box> */}
          <Heading as="h2" size="md" mb={6}>
            Find Password
          </Heading>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input name="username" type="text" autoFocus />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" />
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>

          <Flex justifyContent="space-between" minW="380px">
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={mutation.isLoading}
              type="submit"
            >
              Find
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
