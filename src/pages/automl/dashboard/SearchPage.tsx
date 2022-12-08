import {DeleteIcon, SearchIcon, StarIcon} from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Tr,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import {useMutation, useQuery} from '@tanstack/react-query'
import {format} from 'date-fns'
import {identity, pickBy} from 'lodash'
import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {deleteProject, searchProject} from '../../../fetchers'
import {queryClient} from '../../../queryClient'
import {ProjectItem} from '../../../types/data'

function ProjectSummaryCard({proj}: {proj: ProjectItem}) {
  const navigate = useNavigate()

  const deleteProjMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['projects'])
      // navigate(``)
    },
  })

  const status = proj.status
  const createdAt = proj.createdAt && new Date(proj.createdAt)

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
      onClick={() => navigate(`../../projects/${proj.name}`)}
    >
      <Flex mb={3}>
        <Box flex={1} fontWeight="bold" color="#0f70d4">
          {proj.name}
        </Box>
        {/* <Box p={2}>{status === 'inline' ? 'running' : status}</Box> */}
        <Box fontWeight={500} color="#19aa99">
          {status}
        </Box>
      </Flex>
      <Box>Model: {proj.config.model}</Box>
      <Box>Datafile: {proj.config.datafile.replace(proj.name + '/', '')}</Box>
      {/* <Box>{JSON.stringify(args)}</Box> */}
      <Box fontSize="12px">
        created at: {createdAt && format(createdAt, 'yyyy-MM-dd HH:mm:ss')}
      </Box>
      <Box mt={2} textAlign="right">
        <Button
          size="sm"
          // colorScheme="red"
          isLoading={deleteProjMut.isLoading}
          onClick={(e) => {
            e.stopPropagation()
            window.confirm('Are you sure?') && deleteProjMut.mutate(proj._id)
          }}
        >
          <DeleteIcon />
        </Button>
      </Box>
    </Box>
  )
}

function ResultItem({proj}: {proj: ProjectItem}) {
  return (
    <Box border="1px solid #ddd" p={1} position="relative" minW="280px">
      {/* <Box pos="absolute" top="10px" right="10px">
        <StarIcon color="yellow.300" />
      </Box> */}

      <Box mt="20px" mb="15px" textAlign="center">
        <Box fontWeight="bold">{proj.name}</Box>
        <Box>Model: {proj.config.model}</Box>
        <Box>Datafile: {proj.config.datafile.replace(proj.name + '/', '')}</Box>
      </Box>
      <Flex justifyContent="space-between">
        <Button size="sm" as={Link} to={`../../projects/${proj.name}/model_card`}>
          Model Card
        </Button>
        <Button size="sm" as={Link} to={`../../projects/${proj.name}`}>
          More Detail
        </Button>
      </Flex>
    </Box>
  )
}

type Option = {
  label: string
  value: string
}
function CustomRadioGroups({
  value,
  options,
  onChange,
}: {
  value?: string | null
  options: Option[]
  onChange: (value: string | null) => void
}) {
  return (
    <Flex>
      {options.map((opt, i) => (
        <Box
          userSelect="none"
          key={opt.value}
          px={2}
          borderLeft={i !== 0 ? '1px solid #ddd' : undefined}
          cursor="pointer"
          onClick={() => onChange(value === opt.value ? null : opt.value)}
          color={value === opt.value ? '#0f70d4' : undefined}
        >
          {opt.label}
        </Box>
      ))}
    </Flex>
  )
}

export function SearchPage() {
  const [search, setSearch] = useState('')
  const [model, setModel] = useState<string | null>(null)
  const [task, setTask] = useState<string | null>(null)
  const [dataset, setDataset] = useState<string | null>(null)
  const [searchOpt, setSearchOpt] = useState<SearchOptions | null>(null)

  function handleSubmit() {
    setSearchOpt({
      searchText: search,
      model,
      task,
      dataset,
    })
  }
  return (
    <>
      <Heading as="h4" size="lg">
        Search
      </Heading>
      <Box pt={4}>
        <Box>
          <form
            onSubmit={(e) => {
              e.stopPropagation()
              e.preventDefault()
              handleSubmit()
            }}
          >
            <Flex my={2}>
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<SearchIcon />} />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  bg="white"
                  type="tel"
                  placeholder="Start searching to select fields"
                />
              </InputGroup>
              <Button ml={2} colorScheme="blue" type="submit">
                Search
              </Button>
            </Flex>
          </form>
          <Table border="1px solid #ddd" borderRadius={5}>
            <Tbody>
              <Tr>
                <Td colSpan={2} fontWeight="bold">
                  Search Option
                </Td>
              </Tr>
              <Tr>
                <Td>Model</Td>
                <Td>
                  <CustomRadioGroups
                    value={model}
                    onChange={setModel}
                    options={[
                      {label: 'KoGPT2', value: 'kogpt2'},
                      {label: 'KoBERT', value: 'kobert'},
                      {label: 'KorsciBERT', value: 'KorsciBERT'},
                    ]}
                  />
                </Td>
              </Tr>
              <Tr>
                <Td>Task</Td>
                <Td>
                  <CustomRadioGroups
                    value={task}
                    onChange={setTask}
                    options={[
                      {label: 'Single-label Classification', value: 'single-class'},
                      {label: 'Multi-label Classification', value: 'multi-class'},
                      {label: 'Text Generation', value: 'text-gen'},
                      {label: 'Question & Answering', value: 'qna'},
                    ]}
                  />
                </Td>
              </Tr>
              {/* <Tr>
                <Td>Dataset</Td>
                <Td>
                  <CustomRadioGroups
                    value={dataset}
                    onChange={setDataset}
                    options={[
                      {label: 'binary.csv', value: 'binary.csv'},
                      {label: 'three.csv', value: 'three.csv'},
                      {label: 'paper_cd1.csv', value: 'paper_cd1.csv'},
                    ]}
                  />
                </Td>
              </Tr> */}
            </Tbody>
          </Table>
          {searchOpt && <SearchResult searchOptions={pickBy(searchOpt, identity)} />}
        </Box>
      </Box>
    </>
  )
}

type SearchOptions = {
  searchText?: string
  model?: string | null
  task?: string | null
  dataset?: string | null
}
function SearchResult({searchOptions}: {searchOptions: SearchOptions}) {
  const {isLoading, data} = useQuery<ProjectItem[]>(
    ['projects', 'search', searchOptions],
    () => searchProject(searchOptions),
  )

  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <>
      <Box mt={4}>
        <Heading as="h5" size="md" mb={2}>
          Star
        </Heading>
        {/* <Box>{JSON.stringify(searchOptions)}</Box> */}
        <Wrap spacing="16px" mt={4}>
          {data?.map((proj) => (
            <WrapItem key={proj._id}>
              <ResultItem proj={proj} />
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </>
  )
}
