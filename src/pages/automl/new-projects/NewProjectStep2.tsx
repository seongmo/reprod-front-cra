import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {useMutation, useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {range} from 'lodash'
import Papa from 'papaparse'
import {useState} from 'react'
import {FileUploader} from 'react-drag-drop-files'
import {useNavigate} from 'react-router-dom'
import './NewProjectPage.css'

const deleteDraft = () => axios.delete('/draft')
const saveDraft = (draft: Step1Data) => axios.post('/draft', draft)

const TASK_LABEL = {
  'multi-class': 'Text Classification (Muti-Class)',
}

function PreviewData({filepath}: {filepath: string}) {
  const {isLoading, data} = useQuery(['preview', filepath], () => {
    return axios.post(`/draft/preview`, {filepath}).then((res) => res.data)
  })
  if (isLoading) {
    return <Box>Loading</Box>
  }

  const csv = Papa.parse(
    data.str,
    //  {header: true}
  )
  const [header, ...list] = csv.data as any[][]
  console.log(list)
  return (
    <Box>
      {/* {filepath} */}
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
    </Box>
  )
}

async function handlePost(project: string, file: File) {
  const formData = new FormData()
  formData.append('project', project)
  formData.append('file', file as Blob)

  return await axios.post('/draft/upload', formData).then((res) => res.data)
}

export function NewProjectStep2({
  config,
  onCreated,
}: {
  config: any
  onCreated: () => void
}) {
  const [file, setFile] = useState<File>()
  const [dsType, setDsType] = useState<string>('file')
  const [uploaded, setUploaded] = useState<string>()
  const navigate = useNavigate()
  const saveMut = useMutation(saveDraft, {
    onSuccess: (res) => {
      onCreated()
    },
  })
  const deleteMut = useMutation(deleteDraft, {
    onSuccess: (res) => {
      navigate(`../dashboard/projects`)
    },
  })
  const uploadMut = useMutation<File>(
    (file: any) => {
      console.log(file)
      return handlePost(config.projectName, file as unknown as File)
    },
    {
      onSuccess: (res: any) => {
        console.log({res})
        const {projectName, filename} = res
        setUploaded([projectName, filename].join('/'))
      },
    },
  )

  const handleChange = (file: File) => {
    console.log(file)
    setFile(file)
    uploadMut.mutate(file as any)
  }
  return (
    <Center>
      <Box border="1px solid #ddd" p={8} mt={10}>
        <Heading as="h3" size="md" mb={4}>
          New Project
        </Heading>
        <Heading as="h4" size="sm" mb={2}>
          {config.projectName}
        </Heading>
        <Heading as="h5" size="xs" mb={4}>
          {
            //@ts-ignore
            TASK_LABEL[config.task] || '-'
          }
        </Heading>
        <Box fontWeight="bold">Dataset 유형</Box>
        <RadioGroup value={dsType} onChange={(v: string) => setDsType(v)} mb={4}>
          <Flex alignItems="flex-start">
            <Radio value="file" mr={5}>
              File Upload
            </Radio>

            <Divider orientation="vertical" />
            <Radio value="preset" flex={1}>
              서비스 제공 Dataset
            </Radio>
          </Flex>
        </RadioGroup>
        <Divider mb={4} />

        {dsType === 'file' ? (
          <Box>
            <Box>csv format을 가진 파일을 업로드하여 주세요.</Box>

            <FileUploader
              multiple={false}
              handleChange={handleChange}
              name="file"
              types={['CSV']}
              classes="file-uploader"
            />
            <p>
              {file
                ? `File name: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(
                    1,
                  )}MB`
                : 'no files uploaded yet'}
            </p>
          </Box>
        ) : (
          <Box>
            <RadioGroup>
              {range(5).map((n) => (
                <Box key={n}>
                  <Radio
                    // value={n}
                    mr={5}
                  >
                    sample_dataset_{n + 1}
                  </Radio>
                </Box>
              ))}
            </RadioGroup>
          </Box>
        )}
        {uploaded && <PreviewData filepath={uploaded} />}
        <Flex justifyContent="space-between" mt={4}>
          <Button
            colorScheme="teal"
            isLoading={saveMut.isLoading}
            type="submit"
            disabled={!file}
            onClick={() => {
              saveMut.mutate({...config, step: 2, filepath: uploaded} as any)
            }}
          >
            Next
          </Button>
          <Button type="button" onClick={() => deleteMut.mutate()}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </Center>
  )
}

type Step1Data = {step: number; projectName: string; task: string; model: string}
