import {DeleteIcon} from '@chakra-ui/icons'
import {Box, Button, Center, Flex, Heading, Icon, Wrap, WrapItem} from '@chakra-ui/react'
import {useMutation, useQuery} from '@tanstack/react-query'
import {format} from 'date-fns'
import {IoMdStar, IoMdStarOutline} from 'react-icons/io'
import {useNavigate} from 'react-router-dom'
import {deleteProject, getProjects, starProject} from '../../../fetchers'
import {queryClient} from '../../../queryClient'
import {ProjectItem} from '../../../types/data'

function Status({status}: {status: string}) {
  const labels = {
    running: 'Running',
    exited: 'Done',
    created: 'Created',
  }
  const colors = {
    created: '#b96b15',
    running: '#1977bb',
    exited: '#19aa99',
  }
  return (
    <Box fontWeight={500} color={colors[status] || '#777'}>
      {labels[status] || status}
    </Box>
  )
}

function ProjectSummaryCard({proj}: {proj: ProjectItem}) {
  const navigate = useNavigate()

  const deleteProjMut = useMutation({
    mutationFn: deleteProject,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['projects'])
      // navigate(``)
    },
  })
  const starProjMut = useMutation({
    mutationFn: starProject,
    onSuccess: (res) => {
      queryClient.invalidateQueries(['projects'])
      // navigate(``)
    },
  })

  const status = proj.status
  const createdAt = proj.createdAt && new Date(proj.createdAt)

  return (
    <Box
      //   bg="#e9eef6"
      bg="#fcfcfc"
      w="280px"
      h="180px"
      _hover={{bg: '#e7f0ff'}}
      borderRadius={5}
      cursor="pointer"
      border="1px solid #dfdfdf"
      p={5}
    >
      <Flex mb={3}>
        <Flex flex={1} fontWeight="bold" color="#0f70d4" alignItems="center">
          <Box onClick={() => navigate(`../../projects/${proj.name}`)}>{proj.name}</Box>
          <Icon
            boxSize={5}
            as={proj.stared ? IoMdStar : IoMdStarOutline}
            color={proj.stared ? 'yellow.400' : 'black'}
            onClick={() => {
              starProjMut.mutate(proj.name)
            }}
          />
        </Flex>
        {/* <Box p={2}>{status === 'inline' ? 'running' : status}</Box> */}
        <Status status={status} />
        {/* <Box fontWeight={500} color="#19aa99">
          {status}
        </Box> */}
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

export function ProjectsPage() {
  const navigate = useNavigate()
  const {isLoading, data} = useQuery<ProjectItem[]>(['projects'], getProjects, {
    refetchInterval: 1000,
  })

  if (isLoading) {
    return <Box>Loading</Box>
  }

  return (
    <>
      <Heading as="h4" size="lg">
        Projects
      </Heading>
      <Box pt={4}>
        <Box>
          <Wrap spacing="16px">
            <WrapItem>
              <Center
                bg="#eee"
                w="280px"
                h="180px"
                borderRadius={5}
                cursor="pointer"
                border="1px solid #dfdfdf"
                _hover={{bg: '#f0f0d0'}}
                onClick={() => navigate(`../../projects/new`)}
              >
                + New Project
              </Center>
            </WrapItem>
            {data?.map((proj) => (
              <WrapItem key={proj._id}>
                <ProjectSummaryCard proj={proj} />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      </Box>
    </>
  )
}
