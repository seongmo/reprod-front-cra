import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {useMutation, useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {last} from 'lodash'
import Papa from 'papaparse'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {deleteDraft, saveDraft} from '../../../fetchers'
import './NewProjectPage.css'

export function NewProjectStep3({
  config,
  onCreated,
}: {
  config: any
  onCreated: () => void
}) {
  const {isLoading, data} = useQuery(['preview', config.filepath], () => {
    return axios
      .post(`/draft/preview`, {filepath: config.filepath})
      .then((res) => res.data)
  })

  const [splitType, setSplitType] = useState<string>('manual')
  const [trainNum, setTrainNum] = useState<number>(70)
  const navigate = useNavigate()
  const mutation = useMutation(saveDraft, {
    onSuccess: (res) => {
      onCreated()
    },
  })
  const deleteMut = useMutation(deleteDraft, {
    onSuccess: (res) => {
      navigate(`../dashboard/projects`)
    },
  })

  if (isLoading) {
    return <Box>Loading</Box>
  }

  const csv = Papa.parse(
    data.str,
    //  {header: true}
  )
  const [header, ...list] = csv.data as any[][]

  const column1 = header[0]
  const column2 = header[1]
  return (
    <Center>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          //@ts-ignore
          // const projectName = e.currentTarget.querySelector('[name=projectName]').value
          // @ts-ignore
          const input = e.currentTarget.querySelector('[name=input]').value
          // @ts-ignore
          const target = e.currentTarget.querySelector('[name=target]').value
          // const model = e.currentTarget.querySelector('[name=model]').value
          const draft = {
            ...config,
            step: 3,
            splitType: splitType,
            train: trainNum,
            test: 100 - trainNum,
            input: input,
            target: target,
          }
          console.log(draft)
          mutation.mutate(draft as any)
        }}
      >
        <Box border="1px solid #ddd" p={8} mt={10}>
          {/* <Box>New Project</Box> */}
          <Heading as="h2" size="md" mb={6}>
            New Project
          </Heading>
          <Heading as="h4" size="sm" mb={2}>
            {config.projectName}
          </Heading>
          <Heading as="h5" size="xs" mb={4}>
            Data Split {'&'} Extraction
          </Heading>
          <Box bg="#f2f2f2" p={1}>
            {/* @ts-ignore */}
            {last(config.filepath.split('/')) || null}
          </Box>
          <Table>
            <Thead>
              <Tr>
                {(header as any[]).map((col: any, i) => (
                  <Th key={i}>{col}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {list.map((row: any, i) => (
                <Tr key={i}>
                  {(row as any[]).map((col: any, j) => (
                    <Td
                      maxH="40px"
                      maxW="500px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      key={j}
                    >
                      {col}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Box fontWeight="bold">Select split type</Box>
          <RadioGroup value={splitType} onChange={(v: string) => setSplitType(v)}>
            <Flex alignItems="flex-start">
              <Flex flex="1" alignItems="flex-start">
                <Radio value="manual" mr={5}>
                  Manual
                </Radio>

                <Box>
                  <FormControl isDisabled={splitType !== 'manual'}>
                    <FormLabel color="#777">column 1</FormLabel>
                    <NumberInput
                      value={trainNum}
                      min={1}
                      max={99}
                      onChange={(n: string) => setTrainNum(Number(n))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl isDisabled={splitType !== 'manual'}>
                    <FormLabel color="#777">column 2</FormLabel>
                    <NumberInput
                      value={100 - trainNum}
                      min={1}
                      max={99}
                      onChange={(n: string) => setTrainNum(100 - Number(n))}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Box>
              </Flex>
              <Divider orientation="vertical" />
              <Radio flex={1} value="auto">
                Auto
              </Radio>
            </Flex>
          </RadioGroup>
          <Box fontWeight="bold">Map your data column</Box>
          <FormControl>
            <FormLabel>column 1</FormLabel>
            <Select name="input" defaultValue={column1}>
              {header.map((col: any, i) => (
                <option key={i}>{col}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>column 2</FormLabel>
            <Select name="target" defaultValue={column2}>
              {header.map((col: any, i) => (
                <option key={i}>{col}</option>
              ))}
            </Select>
          </FormControl>

          <Flex justifyContent="space-between" mt={4}>
            <Button colorScheme="teal" isLoading={mutation.isLoading} type="submit">
              Next
            </Button>
            <Button type="button" onClick={() => deleteMut.mutate()}>
              Cancel
            </Button>
          </Flex>
        </Box>
      </form>
    </Center>
  )
}
