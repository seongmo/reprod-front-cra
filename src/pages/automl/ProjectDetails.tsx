import {SearchIcon} from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Slider,
  SliderThumb,
  SliderTrack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import {useMutation, useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {get, sortBy} from 'lodash'
import React, {useState} from 'react'
import {FaDownload, FaFolder} from 'react-icons/fa'
import Plot from 'react-plotly.js'
import {Link, Navigate, NavLink, Outlet, Route, useParams} from 'react-router-dom'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {docco} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import {
  getProject,
  getProjectAssets,
  getProjectCode,
  getProjectFile,
  getProjectMetrics,
  getProjectModelCard,
  getProjectOutput,
  getProjectPlots,
  getProjectRequirement,
} from '../../fetchers'
import fileDownload from 'js-file-download'
import {ArrowBackIcon} from '@chakra-ui/icons'

function ChartsPage() {
  const {projId} = useParams<{projId: string}>()
  const proj = projId

  const {isLoading, data} = useQuery(['plots', proj], () => {
    return getProjectPlots(proj!)
  })
  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        Learning Curve
      </Heading>
      <Box>
        {data
          .filter((v) => v.file !== 'conf_mat')
          .map(({chart, file}: any) => (
            <Plot key={file} data={chart.data} layout={chart.layout} />
          ))}
      </Box>
    </Box>
  )
}
function ConfusionMetricesPage() {
  const {projId} = useParams<{projId: string}>()
  const proj = projId

  const {isLoading, data} = useQuery(['plots', proj], () => {
    return getProjectPlots(proj!)
  })
  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        Confusion Metrices
      </Heading>
      <Box>
        {data
          .filter((v) => v.file === 'conf_mat')
          .map(({chart, file}: any) => (
            <Plot key={file} data={chart.data} layout={chart.layout} />
          ))}
      </Box>
    </Box>
  )
}
function CodePage() {
  const {projId} = useParams<{projId: string}>()
  const proj = projId

  const {isLoading, data} = useQuery(['code', proj], () => {
    return getProjectCode(proj!)
  })
  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        Code
      </Heading>
      <Box>
        <SyntaxHighlighter language="python" style={docco}>
          {data.code}
        </SyntaxHighlighter>
      </Box>
    </Box>
  )
}
function MetricsPage() {
  const {projId} = useParams<{projId: string}>()
  const proj = projId
  const {isLoading, data} = useQuery(['metrics', proj], () => {
    return getProjectMetrics(proj!)
  })
  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        Metrics
      </Heading>
      <Box>
        <TableContainer flex={1}>
          <Table variant="simple">
            {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
            {/* <colgroup>
              <col width="100%" />
              <col />
            </colgroup> */}
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Value</Th>
                <Th>Epoch</Th>
                <Th>Start Time</Th>
                <Th>End Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((v: any) => (
                <Tr key={v.key}>
                  <Td>
                    <Box display="flex">{v.key}</Box>
                  </Td>
                  <Td>{v.value}</Td>
                  <Td></Td>
                  <Td></Td>
                  <Td></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

const hyperparamList = [
  {key: 'projectName', label: 'project'},
  {key: 'task', label: 'task'},
  {key: 'model', label: 'model'},
  {key: 'datafile', label: 'data path'},
  {key: 'split_type', label: 'split type'},
  {key: 'train', label: 'train'},
  {key: 'test', label: 'test'},
  {key: 'input', label: 'input'},
  {key: 'target', label: 'target'},
  {key: 'max_length', label: 'max_length'},
  {key: 'manual.n_epochs', label: 'n_epochs'},
  {key: 'manual.lr', label: 'lr'},
  {key: 'manual.batch_size', label: 'batch_size'},
  {key: 'manual.dropout', label: 'Dropout'},
  // {key: 'hyparams', label: 'hyparams'},
]

function HyperparametersPage() {
  const {projId} = useParams<{projId: string}>()
  const proj = projId
  const {isLoading, data} = useQuery(['projects', proj], () => {
    return getProject(proj!)
  })
  if (isLoading) {
    return <Box>Loading</Box>
  }
  const hyperparams = data.config
  console.log(data.config)
  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        Hyperparameters
      </Heading>
      <Box>
        <TableContainer flex={1}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {hyperparamList.map((v: any) => (
                <Tr key={v.key}>
                  <Td>{v.label}</Td>
                  <Td>{get(hyperparams, v.key)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

function OutputPage() {
  const {projId} = useParams<{projId: string}>()
  const proj = projId

  const {isLoading, data} = useQuery(['output', proj], () => {
    return getProjectOutput(proj!)
  })
  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        Output
      </Heading>
      <Box>
        <SyntaxHighlighter language="shell" style={docco}>
          {data.output}
        </SyntaxHighlighter>
      </Box>
    </Box>
  )
}
function InstalledPackagesPage() {
  const {projId} = useParams<{projId: string}>()
  const proj = projId

  const {isLoading, data} = useQuery(['requirement', proj], () => {
    return getProjectRequirement(proj!)
  })
  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        Installed packages
      </Heading>
      <Box>
        <SyntaxHighlighter language="shell" style={docco}>
          {data.requirement}
        </SyntaxHighlighter>
      </Box>
    </Box>
  )
}

function getPath(tree, path: string[]) {
  return path.reduce((acc, v) => {
    return acc.children.find((c) => c.name === v)
  }, tree)
}

function FileView({projKey, filepath}: {projKey: string; filepath: string}) {
  const {isLoading, data} = useQuery(['file', projKey, filepath], () => {
    return getProjectFile(projKey, filepath)
  })
  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <>
      <Heading as="h5" size="sm" mb={4}>
        {data.basename}
      </Heading>
      <SyntaxHighlighter language={data.extname.replace('^.', '')} style={docco}>
        {data.content}
      </SyntaxHighlighter>
      <Box textAlign="right">
        <Button
          mt={4}
          colorScheme="teal"
          // isLoading={props.isSubmitting}
          type="button"
          // onClick={() => deleteMut.mutate()}
        >
          Download
        </Button>
      </Box>
    </>
  )
}

function AssetsPage() {
  const {projId} = useParams<{projId: string}>()
  const proj = projId
  const {isLoading, data} = useQuery(['assets', proj], () => {
    return getProjectAssets(proj!)
  })
  const [curPath, setCurPath] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  if (isLoading) {
    return <Box>Loading</Box>
  }

  const files = getPath(data, curPath)

  const list = sortBy(files.children, ['type', 'name'])

  async function handleDownload(asset: any) {
    console.log(asset)
    const res = await axios.post(
      `/projects/${proj}/file-raw`,
      {filepath: asset.path},
      {responseType: 'blob'},
    )
    fileDownload(res.data, asset.name)
  }

  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        Asset & Artifact
      </Heading>
      <Heading as="h5" size="sm" mb={4}>
        Experiment Name
      </Heading>
      <Flex minH="600px">
        <Box flex={1} pr={4}>
          <Box>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
              {/* <InputLeftElement pointerEvents="none" children={<Icon as={FaFolder} />} /> */}

              <Input type="tel" placeholder="Start searching to select fields" />
            </InputGroup>
          </Box>

          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" onClick={() => setCurPath([])}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            {curPath.map((v, i, arr) => (
              <BreadcrumbItem key={i} isCurrentPage={arr.length - 1 === i}>
                <BreadcrumbLink href="#">{v}</BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>

          <TableContainer flex={1}>
            <Table variant="simple">
              {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
              {/* <colgroup>
              <col width="100%" />
              <col />
            </colgroup> */}
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Preview</Th>
                </Tr>
              </Thead>
              <Tbody>
                {list.map((v: any) => (
                  <React.Fragment key={v.path}>
                    {v.type === 'directory' ? (
                      <Tr>
                        <Td>
                          <Box
                            display="flex"
                            onClick={() => setCurPath((p) => [...p, v.name])}
                            _hover={{color: 'blue.500', cursor: 'pointer'}}
                          >
                            <Icon as={FaFolder} boxSize={5} mr={2} /> {v.name}
                          </Box>
                        </Td>
                        <Td></Td>
                      </Tr>
                    ) : (
                      <Tr bg={selectedFile === v.path ? 'gray.100' : 'white'}>
                        <Td>
                          <Box
                            color={selectedFile === v.path ? 'blue.500' : undefined}
                            fontWeight={selectedFile === v.path ? 'bold' : undefined}
                            display="flex"
                            onClick={() => setSelectedFile(v.path)}
                            _hover={{color: 'blue.500', cursor: 'pointer'}}
                          >
                            {v.name}
                          </Box>
                        </Td>
                        <Td>
                          <Box display="flex" justifyContent="flex-end">
                            <Icon
                              as={FaDownload}
                              boxSize={5}
                              mr={2}
                              onClick={() => handleDownload(v)}
                            />
                          </Box>
                        </Td>
                      </Tr>
                    )}
                  </React.Fragment>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Box py={2}>
          <Divider orientation="vertical" color={'#222'} />
        </Box>
        <Box pl={4} flex={1}>
          {selectedFile && <FileView projKey={proj!} filepath={selectedFile} />}
        </Box>
      </Flex>
    </Box>
  )
}
const sampleText =
  '텍스트 분류(text classification)는 문자열로 표현된 데이터를 사전에 정해진 분류나 주제, 레이블 등으로 매핑(mapping)하는 자연어 처리 및 기계 학습 파생 데이터 문제를 가리킨다. 각종 신문 기사, 학술 논문, 웹 페이지, SNS 메세지 등 다양한 종류의 텍스트 데이터가 이용가능해짐에 따라 이러한 데이터에 대한 분류 문제를 해결하기 위해 여러가지 시도가 이뤄지고 있다. 전통적인 기계 학습 기법인 Support Vector Machines부터[1] 신경망(neural networks)을 활용하는[2] 넓은 스펙트럼의 방법들이 제안되어 왔으며, 최근에는 BERT, GPT 등 규모가 큰 딥러닝 모델을 기반으로 전례 없는 높은 정확도를 달성하는 방법들도 제시되고 있다.'

type ClassifyApiData = {projKey: string; text: string}
type ClassifyApiResp = {
  msg: string
  intent: string
  scores: {class: string | number; score: number}[]
}

const callClassifyApi = ({projKey, text}: ClassifyApiData) =>
  axios.post<ClassifyApiResp>(`/projects/${projKey}/api`, {text})

function ApiPage() {
  const {projId} = useParams<{projId: string}>()
  const proj = projId

  const [result, setResult] = useState<ClassifyApiResp | null>(null)
  const [text, setText] = useState(sampleText)
  // const {isLoading, data} = useQuery(['code', proj], () => {
  //   return axios(`/code/${proj}`).then((res) => res.data)
  // })
  const callApiMut = useMutation<{data: ClassifyApiResp}, unknown, ClassifyApiData>(
    callClassifyApi,
    {
      onSuccess: (res) => {
        // onCreated()
        setResult(res.data)
      },
    },
  )
  // if (isLoading) {
  //   return <Box>Loading</Box>
  // }

  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        API
      </Heading>
      <Box maxW="700px">
        <Heading as="h4" size="sm" mb={4}>
          Text Classification Model Test
        </Heading>
        <Textarea
          placeholder="Input text"
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Heading as="h6" size="xs" mt={4}>
          Key
        </Heading>
        <Input placeholder="" defaultValue="test-api-key-1" />
        <Accordion border="1px solid #ddd" my={2}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Manual
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Box textAlign="right">
          <Button
            // mt={4}
            colorScheme="teal"
            // isLoading={props.isSubmitting}
            isLoading={callApiMut.isLoading}
            type="button"
            onClick={() => callApiMut.mutate({projKey: proj!, text})}
          >
            Enter
          </Button>
        </Box>
        {result && (
          <>
            <Heading as="h4" size="sm" mb={4}>
              Predict result
            </Heading>
            <Box border="1px solid #ddd" p={2} borderRadius="6px">
              입력 문장에 해당하는 클래스는 <strong>{result.intent}</strong> 입니다.
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

function ModelCardPage() {
  const {projId} = useParams<{projId: string}>()
  const proj = projId
  const {isLoading, data, isError} = useQuery(['model-card', proj], () => {
    return getProjectModelCard(proj!)
  })

  if (isLoading) {
    return <Box>Loading</Box>
  }
  if (isError) {
    return <Box>Error!</Box>
  }

  console.log(data)
  return (
    <Box p={4}>
      <Heading as="h3" size="md" mb={4}>
        ModelCard
      </Heading>

      <Box>
        <SyntaxHighlighter style={docco} language="json">
          {data.projectCard}
        </SyntaxHighlighter>
      </Box>
    </Box>
  )
}

function SidebarMenu({label, to}: {label: string; to: string}) {
  return (
    <NavLink to={to}>
      {({isActive}) => (
        <Box
          borderLeft="5px solid transparent"
          borderColor={isActive ? '#0f70d4' : undefined}
          bg={isActive ? 'white' : '#f2f2f2'}
          // color={isActive ? '#285e61' : '#2d3748'}
          color={isActive ? '#0f70d4' : '#2d3748'}
          fontWeight={isActive ? 'bold' : 'normal'}
          cursor="pointer"
          borderBottom="1px solid #ccc"
          py={2}
          px={4}
        >
          {label}
        </Box>
      )}
    </NavLink>
  )
}

function ProjectDetail() {
  return (
    <Box pos="relative">
      <Box
        h="100vh"
        pos="fixed"
        top={0}
        left={0}
        w="200px"
        bg="#fafafa"
        borderRight={'1px solid #ddd'}
      >
        <Link to="../dashboard/projects">
          <Box fontWeight="bold" py={2} px={2} bg="white" borderBottom={'1px solid #ddd'}>
            <ArrowBackIcon /> Back
          </Box>
        </Link>
        <SidebarMenu label="Learning Curve" to="charts" />
        <SidebarMenu label="Confusion Matrices" to="confusion_metrices" />
        <SidebarMenu label="Metrics" to="metrics" />
        <SidebarMenu label="Hyperparameters" to="hyperparameters" />
        <SidebarMenu label="Output" to="output" />
        <SidebarMenu label="Code" to="code" />
        <SidebarMenu label="Installed packages" to="installed_packages" />
        <SidebarMenu label="Assets & Artifacts" to="assets" />
        <SidebarMenu label="API" to="api" />
        <SidebarMenu label="ModelCard" to="model_card" />
      </Box>
      <Box flex={1} ml="200px">
        <Outlet />
      </Box>
    </Box>
  )
}

// export const projectsRouter = {
//   path: 'projects/:projId',
//   element: <ProjectDetail />,
//   children: [
//     {index: true, element: <Navigate to="charts" />},
//     {path: 'charts', element: <ChartsPage />},
//     {path: 'code', element: <CodePage />},
//     {path: 'assets', element: <AssetsPage />},
//     {path: 'api', element: <ApiPage />},
//     {path: 'model_card', element: <ModelCardPage />},
//   ],
// }

export const ProjectRoutes = (
  <Route path="projects/:projId" element={<ProjectDetail />}>
    <Route path="charts" element={<ChartsPage />} />
    <Route path="confusion_metrices" element={<ConfusionMetricesPage />} />
    <Route path="metrics" element={<MetricsPage />} />
    <Route path="hyperparameters" element={<HyperparametersPage />} />
    <Route path="output" element={<OutputPage />} />
    <Route path="code" element={<CodePage />} />
    <Route path="installed_packages" element={<InstalledPackagesPage />} />

    {/* <Route path="hyperparameters" element={<ChartsPage />} /> */}
    {/* <Route path="output" element={<ChartsPage />} /> */}

    <Route path="assets" element={<AssetsPage />} />
    <Route path="api" element={<ApiPage />} />
    <Route path="model_card" element={<ModelCardPage />} />
    <Route index element={<Navigate to="charts" />} />
  </Route>
)
